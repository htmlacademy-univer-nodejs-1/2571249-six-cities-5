import { injectable } from "inversify";
import mongoose from "mongoose";
import type { DocumentType } from "@typegoose/typegoose";

import type { CreateOfferDto } from "../dto/create-offer.dto.js";
import type { UpdateOfferDto } from "../dto/update-offer.dto.js";
import { CommentModel } from "../models/comment.entity.js";
import { OfferModel, type OfferEntity } from "../models/offer.entity.js";
import { UserModel } from "../models/user.entity.js";
import type { City } from "../../types/enums.js";

import type { IOfferService } from "./offer-service.interface.js";

@injectable()
export class OfferService implements IOfferService {
  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return (await OfferModel.findById(id).populate("host").exec()) as DocumentType<OfferEntity> | null;
  }

  public async create(data: CreateOfferDto & { host: string }): Promise<DocumentType<OfferEntity>> {
    const { rating, ...offerData } = data;
    const offer = new OfferModel({
      ...offerData,
      publicationDate: new Date(),
      isFavorite: false,
      commentCount: 0,
      rating: 0,
    });
    // @ts-ignore - typegoose save() type inference issue
    return offer.save();
  }

  public async update(id: string, data: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await OfferModel.findByIdAndUpdate(id, data, { new: true }).populate("host").exec();
    return offer as DocumentType<OfferEntity> | null;
  }

  public async delete(id: string): Promise<void> {
    await OfferModel.findByIdAndDelete(id).exec();
  }

  public async findMany(options: { limit?: number; city?: City }): Promise<DocumentType<OfferEntity>[]> {
    const { limit = 60, city } = options;
    const query = city ? { city } : {};

    return (await OfferModel.find(query)
      .populate("host")
      .sort({ publicationDate: -1 })
      .limit(limit)
      .exec()) as DocumentType<OfferEntity>[];
  }

  public async findPremiumByCity(city: City, limit: number = 3): Promise<DocumentType<OfferEntity>[]> {
    return (await OfferModel.find({ city, isPremium: true })
      .populate("host")
      .sort({ publicationDate: -1 })
      .limit(limit)
      .exec()) as DocumentType<OfferEntity>[];
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await UserModel.findById(userId).exec();
    if (!user || !user.favorites || user.favorites.length === 0) {
      return [];
    }

    return (await OfferModel.find({ _id: { $in: user.favorites } })
      .populate("host")
      .sort({ publicationDate: -1 })
      .exec()) as DocumentType<OfferEntity>[];
  }

  public async addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      return null;
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    if (!user.favorites.includes(offerId)) {
      user.favorites.push(offerId);
      // @ts-ignore - typegoose save() type inference issue
      await user.save();
    }

    return (await OfferModel.findById(offerId).populate("host").exec()) as DocumentType<OfferEntity> | null;
  }

  public async removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      return null;
    }

    if (user.favorites) {
      user.favorites = user.favorites.filter((id) => id.toString() !== offerId);
      // @ts-ignore - typegoose save() type inference issue
      await user.save();
    }

    return (await OfferModel.findById(offerId).populate("host").exec()) as DocumentType<OfferEntity> | null;
  }

  public async incrementCommentCount(offerId: string): Promise<void> {
    await OfferModel.findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } }).exec();
  }

  public async updateRating(offerId: string): Promise<void> {
    const result = await CommentModel.aggregate([
      { $match: { offer: new mongoose.Types.ObjectId(offerId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]).exec();

    const avgRating = result.length > 0 && result[0].avgRating !== null
      ? Math.round(result[0].avgRating * 10) / 10
      : 0;

    await OfferModel.findByIdAndUpdate(offerId, { rating: avgRating }).exec();
  }
}
