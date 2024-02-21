import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type AuthorizationCodeDocument = AuthorizationCode & Document;

export class AuthorizationCode extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const AuthorizationCodeSchema =
  SchemaFactory.createForClass(AuthorizationCode);
AuthorizationCodeSchema.loadClass(AuthorizationCode);

AuthorizationCodeSchema.index({ "payload.grantId": 1 });
AuthorizationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
