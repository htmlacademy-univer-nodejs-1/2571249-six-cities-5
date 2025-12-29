import type { DocumentType } from "@typegoose/typegoose";

import type { OfferEntity } from "../models/offer.entity.js";

import type { BaseService } from "./base-service.interface.js";

export interface IOfferService extends BaseService<DocumentType<OfferEntity>> { }

