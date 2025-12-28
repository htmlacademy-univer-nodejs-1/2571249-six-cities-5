import type {
  City,
  HousingType,
  Amenity,
  Location,
} from "../types/entities.js";

export const CITY_LOCATIONS: Record<City, Location> = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 },
};

export const CITIES: City[] = [
  "Paris",
  "Cologne",
  "Brussels",
  "Amsterdam",
  "Hamburg",
  "Dusseldorf",
];

export const HOUSING_TYPES: HousingType[] = [
  "apartment",
  "house",
  "room",
  "hotel",
];

export const AMENITIES: Amenity[] = [
  "Breakfast",
  "Air conditioning",
  "Laptop friendly workspace",
  "Baby seat",
  "Washer",
  "Towels",
  "Fridge",
];

export const TSV_HEADERS = [
  "title",
  "description",
  "publicationDate",
  "city",
  "preview",
  "images",
  "isPremium",
  "isFavorite",
  "rating",
  "type",
  "bedrooms",
  "guests",
  "price",
  "amenities",
  "hostName",
  "hostEmail",
  "hostAvatar",
  "hostPassword",
  "isPro",
  "latitude",
  "longitude",
];
