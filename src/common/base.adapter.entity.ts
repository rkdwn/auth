import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { AdapterPayload } from "oidc-provider";

export type BaseAdapterEntityDocument = BaseAdapterEntity & Document;

export type IndexKeyType = {
  index: Partial<Record<string, 1 | -1>>[];
  unique: boolean;
};

@Schema()
export class BaseAdapterEntity {
  @Prop({ type: String })
  _id: { type: String };

  @Prop({ type: Object })
  payload: AdapterPayload;

  @Prop({ type: Date })
  expiresAt?: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  constructor() {
    const now = new Date();
    this.createdAt = now;
    this.payload = {};
    this.updatedAt = now;
  }
}

export function createIndex(
  schema: mongoose.Schema,
  indexList: IndexKeyType[],
) {
  indexList.forEach((indexItem: IndexKeyType) => {
    const indexField = indexItem.index.reduce((acc, cur) => {
      return Object.assign(acc, cur);
    }, {});
    const indexName = indexItem.index
      .reduce((acc, cur) => [...acc, Object.keys(cur)], [])
      .join("-");
    schema.index(indexField, {
      unique: indexItem.unique,
      name: indexName,
    });
  });
}
