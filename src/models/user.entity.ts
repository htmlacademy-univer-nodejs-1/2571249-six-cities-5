import { prop, getModelForClass } from "@typegoose/typegoose";
import type { User } from "../types/entities.js";

export class UserEntity implements User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: false })
  public avatar?: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true })
  public isPro!: boolean;
}

export const UserModel = getModelForClass(UserEntity, {
  schemaOptions: {
    timestamps: true,
  },
});
