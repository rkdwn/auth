import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  constructor({
    id,
    name,
    age,
    email,
    loginId,
    loginPassword,
    loginFailCount,
    phone,
  }: {
    id: string;
    name: string;
    age?: number;
    email?: string;
    loginId: string;
    loginPassword: string;
    loginFailCount?: number;
    phone?: string;
  }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
    this.loginId = loginId;
    this.loginPassword = loginPassword;
    this.loginFailCount = loginFailCount;
    this.phone = phone;
  }
  @Prop({ required: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;

  @Prop()
  loginId: string;

  @Prop()
  loginPassword: string;

  @Prop()
  loginPasswordSalt: string;

  @Prop()
  loginFailCount: number;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

UserSchema.index({ id: 1 });
UserSchema.index({ name: 1 });
