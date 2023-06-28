import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type SessionDocument = Session & Document;

export class Session extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.loadClass(Session);

SessionSchema.index({ "payload.uid": 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
