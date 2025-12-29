import { createWriteStream } from "node:fs";
import { resolve as resolvePath } from "node:path";
import type { WriteStream } from "node:fs";

import axios from "axios";
import chalk from "chalk";

import type { Offer } from "../../types/offer.js";
import { City, HousingType, Amenity } from "../../types/enums.js";

import { CITY_LOCATIONS } from "../../utils/constants.js";
import {
  getRandomInt,
  getRandomElement,
  getRandomElements,
  getRandomBool,
} from "../../utils/random.js";
import { generateTSVHeader, offerToTSVRow } from "../../utils/tsv.js";

import type { Command } from "../command.interface.js";

async function fetchOffers(url: string): Promise<Offer[]> {
  const response = await axios.get<Offer[]>(`${url}/offers`);
  return response.data;
}

function validateArgs(args: string[]): void {
  if (args.length < 3) {
    throw new Error("Неправильные аргументы. Используйте: --generate <n> <filepath> <url>");
  }
}

function writeStreamData(
  writeStream: WriteStream,
  data: string
): Promise<void> {
  return new Promise((resolve) => {
    const canContinue = writeStream.write(data);
    if (canContinue) {
      resolve();
    } else {
      writeStream.once("drain", resolve);
    }
  });
}

function generateOffer(
  baseOffer: Offer,
  url: string,
  index: number
): Offer {
  const city = getRandomElement(Object.values(City));
  const housingType = getRandomElement(Object.values(HousingType));
  const location = CITY_LOCATIONS[city];
  const amenities = getRandomElements(
    Object.values(Amenity),
    getRandomInt(1, Object.values(Amenity).length)
  );

  return {
    title: baseOffer.title,
    description: baseOffer.description,
    publicationDate: new Date().toISOString(),
    city,
    preview: `${url}/preview${index}.jpg`,
    images: Array.from(
      { length: 6 },
      (_, idx) => `${url}/img${index}-${idx + 1}.jpg`
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
}

async function writeOffersToFile(
  writeStream: WriteStream,
  serverOffers: Offer[],
  count: number,
  url: string
): Promise<void> {
  await writeStreamData(writeStream, `${generateTSVHeader()}\n`);

  for (let i = 1; i <= count; i++) {
    const baseOffer = getRandomElement(serverOffers);
    const generatedOffer = generateOffer(baseOffer, url, i);
    await writeStreamData(writeStream, `${offerToTSVRow(generatedOffer)}\n`);
  }

  writeStream.end();
}

function printGenerateResult(count: number, filePath: string): void {
  console.log(
    chalk.green(
      `Файл с ${chalk.bold(String(count))} предложениями успешно создан: ${filePath}`
    )
  );
}

async function waitForStreamFinish(writeStream: WriteStream): Promise<void> {
  return new Promise<void>((resolve) => {
    writeStream.on("finish", resolve);
  });
}

export class GenerateCommand implements Command {
  getName(): string {
    return "--generate";
  }

  async execute(args: string[]): Promise<void> {
    try {
      validateArgs(args);

      const count = parseInt(args[0], 10);
      const filePath = args[1];
      const url = args[2];

      const serverOffers = await fetchOffers(url);

      const fullPath = resolvePath(process.cwd(), filePath);
      const writeStream = createWriteStream(fullPath);

      await writeOffersToFile(writeStream, serverOffers, count, url);
      await waitForStreamFinish(writeStream);

      printGenerateResult(count, fullPath);
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error instanceof Error ? error.message : String(error)}`));
      process.exitCode = 1;
    }
  }
}

