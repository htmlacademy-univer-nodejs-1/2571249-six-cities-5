#!/usr/bin/env node

import axios from "axios";
import chalk from "chalk";

import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { createInterface } from "node:readline";

import { printOffer } from "./utils/print.js";

import type { Offer } from "./types/entities.js";
import { City, HousingType, Amenity } from "./types/entities.js";
import {
  getRandomInt,
  getRandomElement,
  getRandomElements,
  getRandomBool,
} from "./utils/random.js";
import { CITY_LOCATIONS, TSV_HEADERS } from "./utils/constants.js";

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
  const packageJsonPath = resolvePath(process.cwd(), "package.json");
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

function parseTSVRow(values: string[], headers: string[]): Offer | null {
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

async function importData(filePath: string): Promise<void> {
  const fullPath = resolvePath(process.cwd(), filePath);
  const fileStream = createReadStream(fullPath);
  const rl = createInterface({
    input: fileStream,
  });

  let headers: string[] | null = null;
  let importedCount = 0;

  return new Promise<void>((resolve) => {
    rl.on("line", (line) => {
      if (!headers) {
        headers = parseTSVLine(line);
        return;
      }

      const offer = parseTSVRow(parseTSVLine(line), headers);
      if (offer) {
        importedCount++;
        printOffer(offer);
      }
    });

    rl.on("close", () => {
      console.log(
        chalk.green(
          `Успешно импортировано ${chalk.bold(
            String(importedCount)
          )} предложений.\n`
        )
      );
      resolve();
    });
  });
}

function generateTSVLine(values: string[]): string {
  return values.join("\t");
}

function offerToTSVRow(offer: Offer): string {
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

async function fetchOffers(url: string): Promise<Offer[]> {
  const response = await axios.get<Offer[]>(`${url}/offers`);
  return response.data;
}

async function generateData(
  count: number,
  filePath: string,
  url: string
): Promise<void> {
  const serverOffers = await fetchOffers(url);

  const fullPath = resolvePath(process.cwd(), filePath);
  const writeStream = createWriteStream(fullPath);

  const writeStreamData = (data: string): Promise<void> =>
    new Promise((resolve) => {
      const canContinue = writeStream.write(data);
      if (canContinue) {
        resolve();
      } else {
        writeStream.once("drain", resolve);
      }
    });

  await writeStreamData(`${generateTSVLine(TSV_HEADERS)}\n`);

  for (let i = 1; i <= count; i++) {
    const baseOffer = getRandomElement(serverOffers);
    const city = getRandomElement(Object.values(City));
    const housingType = getRandomElement(Object.values(HousingType));
    const location = CITY_LOCATIONS[city];
    const amenities = getRandomElements(
      Object.values(Amenity),
      getRandomInt(1, Object.values(Amenity).length)
    );

    const generatedOffer: Offer = {
      title: baseOffer.title,
      description: baseOffer.description,
      publicationDate: new Date().toISOString(),
      city,
      preview: `${url}/preview${i}.jpg`,
      images: Array.from(
        { length: 6 },
        (_, idx) => `${url}/img${i}-${idx + 1}.jpg`
      ),
      isPremium: getRandomBool(),
      isFavorite: getRandomBool(),
      rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      type: housingType,
      bedrooms: getRandomInt(1, 8),
      guests: getRandomInt(1, 10),
      price: getRandomInt(100, 100000),
      amenities,
      host: {
        name: baseOffer.host.name,
        email: baseOffer.host.email,
        avatar: baseOffer.host.avatar,
        password: baseOffer.host.password,
        isPro: getRandomBool(),
      },
      commentCount: 0,
      location,
    };

    await writeStreamData(`${offerToTSVRow(generatedOffer)}\n`);
  }

  writeStream.end();

  return new Promise<void>((promiseResolve) => {
    writeStream.on("finish", () => {
      console.log(
        chalk.green(
          `Файл с ${chalk.bold(
            String(count)
          )} предложениями успешно создан: ${fullPath}`
        )
      );
      promiseResolve();
    });
  });
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
      importData(args[1]);
      break;
    case "--generate":
      generateData(parseInt(args[1], 10), args[2], args[3]);
      break;
    default:
      console.error(chalk.red(`Неизвестная команда: ${chalk.yellow(command)}`));
      console.error("Используйте --help для просмотра доступных команд.");
      process.exitCode = 1;
      break;
  }
}

main();
