import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AccountService } from "./account.service";

@Module({
  imports: [UserModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
