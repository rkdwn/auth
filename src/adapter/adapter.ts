import { BaseAdapterEntityDocument } from "../common/base.adapter.entity";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Adapter, AdapterPayload } from "oidc-provider";

@Injectable()
export class CustomAdapter implements Adapter {
  private name: string;
  private model: Model<BaseAdapterEntityDocument>;

  constructor(name: string, model: Model<BaseAdapterEntityDocument>) {
    this.name = name;
    this.model = model;
  }

  /**
   *
   * Update or Create an instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier that oidc-provider will use to reference this model instance for
   * future operations.
   * @param {object} payload Object with all properties intended for storage.
   * @param {integer} expiresIn Number of seconds intended for this model to be stored.
   *
   */
  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn: number,
  ): Promise<undefined | void> {
    try {
      let expiresAt: Date;
      if (expiresIn) {
        expiresAt = new Date(Date.now() + expiresIn * 1000);
      }
      if (this.name.toLocaleLowerCase() === "client") {
        //
      }
      await this.model.updateOne(
        { _id: id },
        { $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
        { upsert: true },
      );
      return;
    } catch (e) {
      console.error(`[ADAPTER] (upsert) ${e}`);
    }
  }

  /**
   *
   * Return previously stored instance of an oidc-provider model.
   *
   * @return {Promise} Promise fulfilled with what was previously stored for the id (when found and
   * not dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async find(id: string): Promise<AdapterPayload | undefined | void> {
    try {
      const _result = await this.model.findOne<BaseAdapterEntityDocument>(
        { _id: id },
        { payload: 1 },
      );
      if (!_result) return undefined;
      return _result.payload;
    } catch (e) {
      console.error(`[ADAPTER] (find) ${JSON.stringify(e)}`);
    }
  }

  /**
   *
   * Return previously stored instance of DeviceCode by the end-user entered user code. You only
   * need this method for the deviceFlow feature
   *
   * @return {Promise} Promise fulfilled with the stored device code object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} userCode the user_code value associated with a DeviceCode instance
   *
   */
  async findByUserCode(
    userCode: string,
  ): Promise<AdapterPayload | undefined | void> {
    try {
      const _result = await this.model.findOne<BaseAdapterEntityDocument>(
        { "payload.userCode": userCode },
        { payload: 1 },
      );
      if (!_result) return undefined;
      return _result.payload;
    } catch (e) {
      console.error(`[ADAPTER] (findByUserCode) ${JSON.stringify(e)}`);
    }
  }

  /**
   *
   * Return previously stored instance of Session by its uid reference property.
   *
   * @return {Promise} Promise fulfilled with the stored session object (when found and not
   * dropped yet due to expiration) or falsy value when not found anymore. Rejected with error
   * when encountered.
   * @param {string} uid the uid value associated with a Session instance
   *
   */
  async findByUid(uid: string): Promise<AdapterPayload | undefined | void> {
    try {
      const _result = await this.model.findOne<BaseAdapterEntityDocument>(
        { "payload.uid": uid },
        { payload: 1 },
      );
      if (!_result) return undefined;
      return _result.payload;
    } catch (e) {
      console.error(`[ADAPTER] (findByUid) ${JSON.stringify(e)}`);
    }
  }

  /**
   *
   * Mark a stored oidc-provider model as consumed (not yet expired though!). Future finds for this
   * id should be fulfilled with an object containing additional property named "consumed" with a
   * truthy value (timestamp, date, boolean, etc).
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async consume(id: string): Promise<undefined | void> {
    try {
      await this.model.findOneAndUpdate(
        { _id: id },
        { $set: { "payload.consumed": Math.floor(Date.now() / 1000) } },
      );
    } catch (e) {
      console.error(`[ADAPTER] (consume) ${JSON.stringify(e)}`);
    }
  }

  /**
   *
   * Destroy/Drop/Remove a stored oidc-provider model. Future finds for this id should be fulfilled
   * with falsy values.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} id Identifier of oidc-provider model
   *
   */
  async destroy(id: string): Promise<undefined | void> {
    try {
      await this.model.deleteOne({ _id: id });
    } catch (e) {
      console.error(`[ADAPTER] (destroy) ${JSON.stringify(e)}`);
    }
  }

  /**
   *
   * Destroy/Drop/Remove a stored oidc-provider model by its grantId property reference. Future
   * finds for all tokens having this grantId value should be fulfilled with falsy values.
   *
   * @return {Promise} Promise fulfilled when the operation succeeded. Rejected with error when
   * encountered.
   * @param {string} grantId the grantId value associated with a this model's instance
   *
   */
  async revokeByGrantId(grantId: string): Promise<undefined | void> {
    try {
      await this.model.deleteMany({ "payload.grantId": grantId });
    } catch (e) {
      console.error(`[ADAPTER] (revokeByGrantId) ${JSON.stringify(e)}`);
    }
  }
}
