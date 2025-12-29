import type { City, HousingType, Amenity } from "./enums.js";
import type { Location } from "./location.js";
import type { User } from "./user.js";

export interface Offer {
  title: string;
  description: string;
  publicationDate: string;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  host: User;
  commentCount: number;
  location: Location;
}

