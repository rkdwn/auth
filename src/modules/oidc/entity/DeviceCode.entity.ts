import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type DeviceCodeDocument = DeviceCode & Document;

export class DeviceCode extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const DeviceCodeSchema = SchemaFactory.createForClass(DeviceCode);
DeviceCodeSchema.loadClass(DeviceCode);

DeviceCodeSchema.index({ "payload.userCode": 1 }, { expireAfterSeconds: 0 });
DeviceCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
