import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type ClientDocument = Client & Document;

export class Client extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.loadClass(Client);

ClientSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
