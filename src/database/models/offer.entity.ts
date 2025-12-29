import { prop, getModelForClass, type Ref } from "@typegoose/typegoose";
import type { Location } from "../../types/location.js";
import { City, HousingType, Amenity } from "../../types/enums.js";
import { UserEntity } from "./user.entity.js";

class LocationEntity implements Location {
  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}

export class OfferEntity {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true, enum: City })
  public city!: City;

  @prop({ required: true })
  public preview!: string;

  @prop({ required: true, type: [String] })
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public isFavorite!: boolean;

  @prop({ required: true })
  public rating!: number;

  @prop({ required: true, enum: HousingType })
  public type!: HousingType;

  @prop({ required: true })
  public bedrooms!: number;

  @prop({ required: true })
  public guests!: number;

  @prop({ required: true })
  public price!: number;

  @prop({ required: true, type: [String], enum: Amenity })
  public amenities!: Amenity[];

  @prop({ required: true, ref: () => UserEntity })
  public host!: Ref<UserEntity>;

  @prop({ required: true, default: 0 })
  public commentCount!: number;

  @prop({ required: true, type: () => LocationEntity, _id: false })
  public location!: LocationEntity;
}

export const OfferModel = getModelForClass(OfferEntity, {
  schemaOptions: {
    timestamps: true,
  },
});
