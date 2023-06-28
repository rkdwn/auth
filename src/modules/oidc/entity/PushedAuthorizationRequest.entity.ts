import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type PushedAuthorizationRequestDocument = PushedAuthorizationRequest &
  Document;

export class PushedAuthorizationRequest extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const PushedAuthorizationRequestSchema = SchemaFactory.createForClass(
  PushedAuthorizationRequest,
);

PushedAuthorizationRequestSchema.loadClass(PushedAuthorizationRequest);

PushedAuthorizationRequestSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
