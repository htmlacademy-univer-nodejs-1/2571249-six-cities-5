import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";

import { OfferEntity } from "./offer.entity.js";
import { UserEntity } from "./user.entity.js";

export class CommentEntity {
  @prop({ required: true })
  public text!: string;

  @prop({ required: true, default: () => new Date() })
  public publicationDate!: Date;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, ref: () => UserEntity })
  public author!: Ref<UserEntity>;

  @prop({ required: true, ref: () => OfferEntity })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity, {
  schemaOptions: {
    timestamps: true,
  },
});

