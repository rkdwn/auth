import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type AccessTokenDocument = AccessToken & Document;

export class AccessToken extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
AccessTokenSchema.loadClass(AccessToken);

AccessTokenSchema.index({ "payload.grantId": 1 });
AccessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
