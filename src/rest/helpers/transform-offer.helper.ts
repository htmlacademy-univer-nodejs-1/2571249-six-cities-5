import type { DocumentType } from "@typegoose/typegoose";

import type { OfferEntity } from "../../database/models/offer.entity.js";
import type { UserEntity } from "../../database/models/user.entity.js";

import { transformUser } from "./transform-user.helper.js";

export function transformOffer(
  offer: DocumentType<OfferEntity>,
  userFavorites?: string[]
): {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  city: string;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  guests: number;
  price: number;
  amenities: string[];
  host: ReturnType<typeof transformUser>;
  commentCount: number;
  location: { latitude: number; longitude: number };
} {
  const host = offer.host as unknown as DocumentType<UserEntity>;
  const isFavorite = userFavorites
    ? userFavorites.includes(offer._id.toString())
    : false;

  return {
    id: offer._id.toString(),
    title: offer.title,
    description: offer.description,
    publicationDate: offer.publicationDate.toISOString(),
    city: offer.city,
    preview: offer.preview,
    images: offer.images,
    isPremium: offer.isPremium,
    isFavorite,
    rating: offer.rating,
    type: offer.type,
    bedrooms: offer.bedrooms,
    guests: offer.guests,
    price: offer.price,
    amenities: offer.amenities,
    host: transformUser(host),
    commentCount: offer.commentCount,
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
    },
  };
}

export function transformOfferListItem(
  offer: DocumentType<OfferEntity>,
  userFavorites?: string[]
): {
  id: string;
  title: string;
  publicationDate: string;
  city: string;
  preview: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  price: number;
  commentCount: number;
} {
  const isFavorite = userFavorites
    ? userFavorites.includes(offer._id.toString())
    : false;

  return {
    id: offer._id.toString(),
    title: offer.title,
    publicationDate: offer.publicationDate.toISOString(),
    city: offer.city,
    preview: offer.preview,
    isPremium: offer.isPremium,
    isFavorite,
    rating: offer.rating,
    type: offer.type,
    price: offer.price,
    commentCount: offer.commentCount,
  };
}

