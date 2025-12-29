import type { Offer } from "../types/entities.js";
import { City, HousingType, Amenity } from "../types/entities.js";
import { TSV_HEADERS } from "./constants.js";

export function parseTSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";

  for (const char of line.trim()) {
    if (char === "\t") {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export function parseTSVRow(values: string[], headers: string[]): Offer | null {
  if (values.length !== headers.length) {
    return null;
  }

  const row: Record<string, string> = {};
  headers.forEach((header, index) => {
    row[header] = values[index];
  });

  return {
    title: row.title,
    description: row.description,
    publicationDate: row.publicationDate,
    city: row.city as City,
    preview: row.preview,
    images: row.images.split(","),
    isPremium: row.isPremium === "true",
    isFavorite: row.isFavorite === "true",
    rating: parseFloat(row.rating),
    type: row.type as HousingType,
    bedrooms: parseInt(row.bedrooms, 10),
    guests: parseInt(row.guests, 10),
    price: parseInt(row.price, 10),
    amenities: row.amenities.split(",") as Amenity[],
    host: {
      name: row.hostName,
      email: row.hostEmail,
      avatar: row.hostAvatar,
      password: row.hostPassword,
      isPro: row.isPro === "true",
    },
    commentCount: 0,
    location: {
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    },
  };
}
export function generateTSVHeader(): string {
  return generateTSVLine(TSV_HEADERS);
}

export function generateTSVLine(values: string[]): string {
  return values.join("\t");
}

export function offerToTSVRow(offer: Offer): string {
  const row = [
    offer.title,
    offer.description,
    offer.publicationDate,
    offer.city,
    offer.preview,
    offer.images.join(","),
    String(offer.isPremium),
    String(offer.isFavorite),
    String(offer.rating),
    offer.type,
    String(offer.bedrooms),
    String(offer.guests),
    String(offer.price),
    offer.amenities.join(","),
    offer.host.name,
    offer.host.email,
    offer.host.avatar ?? "",
    offer.host.password,
    String(offer.host.isPro),
    String(offer.location.latitude),
    String(offer.location.longitude),
  ];
  return generateTSVLine(row);
}



