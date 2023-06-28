import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type GrantDocument = Grant & Document;

export class Grant extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const GrantSchema = SchemaFactory.createForClass(Grant);
GrantSchema.loadClass(Grant);

GrantSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
