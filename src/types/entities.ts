export enum City {
  Paris = "Paris",
  Cologne = "Cologne",
  Brussels = "Brussels",
  Amsterdam = "Amsterdam",
  Hamburg = "Hamburg",
  Dusseldorf = "Dusseldorf",
}

export enum HousingType {
  Apartment = "apartment",
  House = "house",
  Room = "room",
  Hotel = "hotel",
}

export enum Amenity {
  Breakfast = "Breakfast",
  AirConditioning = "Air conditioning",
  LaptopFriendlyWorkspace = "Laptop friendly workspace",
  BabySeat = "Baby seat",
  Washer = "Washer",
  Towels = "Towels",
  Fridge = "Fridge",
}

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

export interface Comment {
  text: string;
  publicationDate: string;
  rating: number;
  author: User;
}
