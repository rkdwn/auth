import { BaseAdapterEntity } from "../../../common/base.adapter.entity";
import { SchemaFactory } from "@nestjs/mongoose";

export type ClientCredentialsDocument = ClientCredentials & Document;

export class ClientCredentials extends BaseAdapterEntity {
  constructor() {
    super();
  }
}
export const ClientCredentialsSchema =
  SchemaFactory.createForClass(ClientCredentials);

ClientCredentialsSchema.loadClass(ClientCredentials);

ClientCredentialsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
