import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type RegistrationAccessTokenDocument = RegistrationAccessToken &
  Document;

export class RegistrationAccessToken extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const RegistrationAccessTokenSchema = SchemaFactory.createForClass(
  RegistrationAccessToken,
);

RegistrationAccessTokenSchema.loadClass(RegistrationAccessToken);

RegistrationAccessTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
