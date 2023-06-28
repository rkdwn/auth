import { BaseAdapterEntity } from "@/common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type ReplayDetectionDocument = ReplayDetection & Document;

export class ReplayDetection extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const ReplayDetectionSchema =
  SchemaFactory.createForClass(ReplayDetection);

ReplayDetectionSchema.loadClass(ReplayDetection);

ReplayDetectionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
