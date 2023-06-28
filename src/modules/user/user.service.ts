import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.entity";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async getUserById(id: string): Promise<User> {
    const _result = await this.userModel.findOne({ id: id });
    return _result;
  }

  async findUserByUserId(userId: string): Promise<User> {
    const _result = await this.userModel.findOne({ loginId: userId });
    return _result;
  }

  async updatePasswordFailCount(
    id: string,
    failCount: number,
  ): Promise<boolean> {
    const _result = await this.userModel.findOneAndUpdate(
      {
        id: id,
      },
      {
        loginFailCount: failCount,
      },
    );
    if (_result) {
      return true;
    }
    return false;
  }

  async getHello(): Promise<string> {
    return "hello";
  }
}
