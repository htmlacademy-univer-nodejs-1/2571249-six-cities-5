import { injectable } from "inversify";

import type { DocumentType } from "@typegoose/typegoose";

import { OfferModel, type OfferEntity } from "../models/offer.entity.js";

import type { IOfferService } from "./offer-service.interface.js";

@injectable()
export class OfferService implements IOfferService {
  async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return (await OfferModel.findById(id).exec()) as DocumentType<OfferEntity> | null;
  }

  async create(data: Partial<OfferEntity>): Promise<DocumentType<OfferEntity>> {
    const offer = new OfferModel(data);
    // @ts-ignore - typegoose save() type inference issue
    return offer.save();
  }
}
