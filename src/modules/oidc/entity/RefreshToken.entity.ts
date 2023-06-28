import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type RefreshTokenDocument = RefreshToken & Document;

export class RefreshToken extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
RefreshTokenSchema.loadClass(RefreshToken);

RefreshTokenSchema.index({ "payload.grantId": 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
