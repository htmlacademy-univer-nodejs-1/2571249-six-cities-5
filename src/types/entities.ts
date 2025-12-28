export type City =
  | "Paris"
  | "Cologne"
  | "Brussels"
  | "Amsterdam"
  | "Hamburg"
  | "Dusseldorf";

export type HousingType = "apartment" | "house" | "room" | "hotel";

export type Amenity =
  | "Breakfast"
  | "Air conditioning"
  | "Laptop friendly workspace"
  | "Baby seat"
  | "Washer"
  | "Towels"
  | "Fridge";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  isPro: boolean;
}

export interface Offer {
  title: string;
  description: string;
  publicationDate: Date;
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
  goods: Amenity[];
  host: User;
  commentCount: number;
  location: Location;
}

export interface Comment {
  text: string;
  publicationDate: Date;
  rating: number;
  author: User;
}
