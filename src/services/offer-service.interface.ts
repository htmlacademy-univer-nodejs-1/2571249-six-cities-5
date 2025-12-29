import type { DocumentType } from "@typegoose/typegoose";

import type { CreateOfferDto } from "../dto/create-offer.dto.js";
import type { UpdateOfferDto } from "../dto/update-offer.dto.js";
import type { OfferEntity } from "../models/offer.entity.js";
import type { City } from "../types/entities.js";

import type { BaseService } from "./base-service.interface.js";

export interface IOfferService extends Omit<BaseService<DocumentType<OfferEntity>>, "create"> {
  create(data: CreateOfferDto & { host: string }): Promise<DocumentType<OfferEntity>>;
  update(id: string, data: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(id: string): Promise<void>;
  findMany(options: { limit?: number; city?: City }): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  removeFromFavorites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  incrementCommentCount(offerId: string): Promise<void>;
  updateRating(offerId: string): Promise<void>;
}

