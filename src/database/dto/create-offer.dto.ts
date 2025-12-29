import type { City, HousingType, Amenity } from "../../types/enums.js";
import type { Location } from "../../types/location.js";

export interface CreateOfferDto {
  title: string;
  description: string;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  location: Location;
}

