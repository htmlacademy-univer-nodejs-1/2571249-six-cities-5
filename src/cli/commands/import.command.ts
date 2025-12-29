import { createReadStream } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { createInterface } from "node:readline";

import chalk from "chalk";
import type { DocumentType } from "@typegoose/typegoose";

import { createContainer } from "../../core/container.js";
import { Service } from "../../core/service.js";
import type { DatabaseClient } from "../../core/database/database.js";

import type { UserEntity } from "../../models/user.entity.js";
import type { Offer } from "../../types/entities.js";
import type { IUserService } from "../../services/user-service.interface.js";
import type { IOfferService } from "../../services/offer-service.interface.js";

import { parseTSVLine, parseTSVRow } from "../../utils/tsv.js";

import type { Command } from "../command.interface.js";

function validateArgs(args: string[]): void {
  if (args.length < 1) {
    throw new Error("Неправильные аргументы. Используйте: --import <filepath>");
  }
}

function processTSVLine(
  line: string,
  headers: string[] | null
): { headers: string[] | null; offer: Offer | null } {
  if (!headers) {
    return { headers: parseTSVLine(line), offer: null };
  }

  const offer = parseTSVRow(parseTSVLine(line), headers);
  return { headers, offer };
}

async function ensureUserExists(
  userService: IUserService,
  host: Offer["host"]
): Promise<DocumentType<UserEntity>> {
  let user = await userService.findByEmail(host.email);

  if (!user) {
    user = await userService.create({
      name: host.name,
      email: host.email,
      avatar: host.avatar,
      password: host.password,
      isPro: host.isPro,
    });
  }

  return user;
}

async function saveOffer(
  offerService: IOfferService,
  userService: IUserService,
  offer: Offer
): Promise<void> {
  const user = await ensureUserExists(userService, offer.host);

  await offerService.create({
    title: offer.title,
    description: offer.description,
    publicationDate: new Date(offer.publicationDate),
    city: offer.city,
    preview: offer.preview,
    images: offer.images,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    rating: offer.rating,
    type: offer.type,
    bedrooms: offer.bedrooms,
    guests: offer.guests,
    price: offer.price,
    amenities: offer.amenities,
    host: user._id,
    commentCount: offer.commentCount,
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
    },
  });
}

function printImportResult(count: number): void {
  console.log(
    chalk.green(
      `Успешно импортировано ${chalk.bold(String(count))} предложений.\n`
    )
  );
}

async function readAndImportTSV(
  filePath: string,
  userService: IUserService,
  offerService: IOfferService
): Promise<number> {
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
  });

  let headers: string[] | null = null;
  let importedCount = 0;

  return new Promise<number>((resolve, reject) => {
    const promises: Promise<void>[] = [];

    rl.on("line", (line) => {
      const result = processTSVLine(line, headers);
      headers = result.headers;

      if (result.offer) {
        promises.push(
          saveOffer(offerService, userService, result.offer).then(() => {
            importedCount++;
          })
        );
      }
    });

    rl.on("close", async () => {
      try {
        await Promise.all(promises);
        resolve(importedCount);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export class ImportCommand implements Command {
  getName(): string {
    return "--import";
  }

  async execute(args: string[]): Promise<void> {
    const container = createContainer();
    const dbClient = container.get<DatabaseClient>(Service.DatabaseClient);
    const userService = container.get<IUserService>(Service.UserService);
    const offerService = container.get<IOfferService>(Service.OfferService);

    try {
      validateArgs(args);

      const filePath = args[0];
      const fullPath = resolvePath(process.cwd(), filePath);

      await dbClient.connect();
      const importedCount = await readAndImportTSV(fullPath, userService, offerService);
      await dbClient.disconnect();

      printImportResult(importedCount);
    } catch (error) {
      console.error(chalk.red(`Ошибка: ${error instanceof Error ? error.message : String(error)}`));
      process.exitCode = 1;
    }
  }
}
