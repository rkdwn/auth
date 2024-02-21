import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type BackchannelAuthenticationRequestDocument =
  BackchannelAuthenticationRequest & Document;

export class BackchannelAuthenticationRequest extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const BackchannelAuthenticationRequestSchema =
  SchemaFactory.createForClass(BackchannelAuthenticationRequest);
BackchannelAuthenticationRequestSchema.loadClass(
  BackchannelAuthenticationRequest,
);

BackchannelAuthenticationRequestSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
