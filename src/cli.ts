#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import chalk from "chalk";

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

function printOffer(offer: Offer): void {
  console.log(chalk.cyan.bold("\nOffer:"));
  console.log(`  ${chalk.yellow("title:")} ${offer.title}`);
  console.log(`  ${chalk.yellow("description:")} ${offer.description}`);
  console.log(
    `  ${chalk.yellow("publicationDate:")} ${offer.publicationDate.toISOString()}`
  );
  console.log(`  ${chalk.yellow("city:")} ${chalk.magenta(offer.city)}`);
  console.log(`  ${chalk.yellow("preview:")} ${offer.preview}`);
  console.log(`  ${chalk.yellow("images:")} ${JSON.stringify(offer.images)}`);
  console.log(
    `  ${chalk.yellow("isPremium:")} ${
      offer.isPremium ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(
    `  ${chalk.yellow("isFavorite:")} ${
      offer.isFavorite ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(`  ${chalk.yellow("rating:")} ${chalk.cyan(String(offer.rating))}`);
  console.log(`  ${chalk.yellow("type:")} ${chalk.magenta(offer.type)}`);
  console.log(`  ${chalk.yellow("bedrooms:")} ${chalk.cyan(offer.bedrooms)}`);
  console.log(`  ${chalk.yellow("guests:")} ${chalk.cyan(offer.guests)}`);
  console.log(
    `  ${chalk.yellow("price:")} ${chalk.cyan(String(offer.price))}`
  );
  console.log(
    `  ${chalk.yellow("amenities:")} ${JSON.stringify(offer.amenities)}`
  );
  console.log(`  ${chalk.yellow("host:")}`);
  console.log(`    ${chalk.yellow("name:")} ${offer.host.name}`);
  console.log(
    `    ${chalk.yellow("email:")} ${offer.host.email}`
  );
  console.log(
    `    ${chalk.yellow("avatar:")} ${
      offer.host.avatar ? offer.host.avatar : "undefined"
    }`
  );
  console.log(`    ${chalk.yellow("password:")} ${offer.host.password}`);
  console.log(
    `    ${chalk.yellow("isPro:")} ${
      offer.host.isPro ? chalk.green("true") : chalk.red("false")
    }`
  );
  console.log(`  ${chalk.yellow("commentCount:")} ${chalk.cyan(offer.commentCount)}`);
  console.log(`  ${chalk.yellow("location:")}`);
  console.log(`    ${chalk.yellow("latitude:")} ${chalk.cyan(offer.location.latitude)}`);
  console.log(
    `    ${chalk.yellow("longitude:")} ${chalk.cyan(offer.location.longitude)}`
  );
}

function importData(filePath: string): void {
  const fullPath = resolve(process.cwd(), filePath);
  const content = readFileSync(fullPath, "utf-8");
  const offers = parseTSV(content);

  console.log(
    chalk.green(
      `Успешно импортировано ${chalk.bold(
        String(offers.length)
      )} предложений.\n`
    )
  );

  for (const offer of offers) {
    printOffer(offer);
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
        console.error(chalk.red("Ошибка: не указан путь к файлу для импорта"));
        process.exitCode = 1;
        break;
      }
      importData(args[1]);
      break;
    default:
      console.error(chalk.red(`Неизвестная команда: ${chalk.yellow(command)}`));
      console.error(
        "Используйте --help для просмотра доступных команд."
      );
      process.exitCode = 1;
      break;
  }
}

main();
