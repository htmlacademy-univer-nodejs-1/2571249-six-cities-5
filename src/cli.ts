#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  Offer,
  User,
  City,
  HousingType,
  Amenity,
  Location,
} from "./types/entities.js";

function showHelp(): void {
  console.log(
    "Программа для подготовки данных для REST API сервера.\n\n" +
      "Пример: cli.js --<command> [--arguments]\n\n" +
      "Команды:\n\n" +
      " --version:                   # выводит номер версии\n" +
      " --help:                      # печатает этот текст\n" +
      " --import <path>:             # импортирует данные из TSV\n" +
      " --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных"
  );
}

function showVersion(): void {
  const packageJsonPath = resolve(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  console.log(packageJson.version);
}

function parseTSVLine(line: string): string[] {
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

function parseTSV(content: string): Offer[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    return [];
  }

  const headers = parseTSVLine(lines[0]);
  const offers: Offer[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseTSVLine(lines[i]);
    if (values.length !== headers.length) {
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    const user: User = {
      name: row.hostName,
      email: row.hostEmail,
      avatar: row.hostAvatar,
      password: row.hostPassword,
      isPro: row.isPro === "true",
    };

    const location: Location = {
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
    };

    const images = row.images.split(",");
    const amenities = row.amenities.split(",") as Amenity[];

    const offer: Offer = {
      title: row.title,
      description: row.description,
      publicationDate: new Date(row.publicationDate),
      city: row.city as City,
      preview: row.preview,
      images,
      isPremium: row.isPremium === "true",
      isFavorite: row.isFavorite === "true",
      rating: parseFloat(row.rating),
      type: row.type as HousingType,
      bedrooms: parseInt(row.bedrooms, 10),
      guests: parseInt(row.guests, 10),
      price: parseInt(row.price, 10),
      amenities,
      host: user,
      commentCount: 0,
      location,
    };

    offers.push(offer);
  }

  return offers;
}

function importData(filePath: string): void {
  const fullPath = resolve(process.cwd(), filePath);
  const content = readFileSync(fullPath, "utf-8");
  const offers = parseTSV(content);

  console.log(`Успешно импортировано ${offers.length} предложений.`);

  for (const offer of offers) {
    console.log(`
title: ${offer.title}
description: ${offer.description}
publicationDate: ${offer.publicationDate.toISOString()}
city: ${offer.city}
preview: ${offer.preview}
images: ${JSON.stringify(offer.images)}
isPremium: ${offer.isPremium}
isFavorite: ${offer.isFavorite}
rating: ${offer.rating}
type: ${offer.type}
bedrooms: ${offer.bedrooms}
guests: ${offer.guests}
price: ${offer.price}
amenities: ${JSON.stringify(offer.amenities)}
host:
  name: ${offer.host.name}
  email: ${offer.host.email}
  avatar: ${offer.host.avatar ?? "undefined"}
  password: ${offer.host.password}
  isPro: ${offer.host.isPro}
commentCount: ${offer.commentCount}
location:
  latitude: ${offer.location.latitude}
  longitude: ${offer.location.longitude}
`);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0] ?? "--help";

  switch (command) {
    case "--help":
      showHelp();
      break;
    case "--version":
      showVersion();
      break;
    case "--import":
      if (args.length < 2) {
        console.error("Ошибка: не указан путь к файлу для импорта");
        process.exitCode = 1;
        break;
      }
      importData(args[1]);
      break;
    default:
      console.error(`Неизвестная команда: ${command}`);
      console.error("Используйте --help для просмотра доступных команд.");
      process.exitCode = 1;
      break;
  }
}

main();
