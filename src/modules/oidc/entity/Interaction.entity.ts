import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type InteractionDocument = Interaction & Document;

export class Interaction extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const InteractionSchema = SchemaFactory.createForClass(Interaction);

InteractionSchema.loadClass(Interaction);

InteractionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
