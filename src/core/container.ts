import "reflect-metadata";
import { Container } from "inversify";

import { Logger } from "./logger/logger.js";
import { Config } from "./config/config.js";
import { Application } from "./application.js";
import { DatabaseClient } from "./database/database.js";

import { UserService } from "../services/user-service.js";
import { OfferService } from "../services/offer-service.js";

import type { ILogger } from "./logger/logger.interface.js";
import type { IConfig } from "./config/config.interface.js";
import type { IUserService } from "../services/user-service.interface.js";
import type { IOfferService } from "../services/offer-service.interface.js";

import { Service } from "./service.js";

export function createContainer(): Container {
  const container = new Container();

  container.bind<ILogger>(Service.Logger).to(Logger).inSingletonScope();
  container.bind<IConfig>(Service.Config).to(Config).inSingletonScope();
  container
    .bind<Application>(Service.Application)
    .to(Application)
    .inSingletonScope();
  container
    .bind<DatabaseClient>(Service.DatabaseClient)
    .to(DatabaseClient)
    .inSingletonScope();
  container
    .bind<IUserService>(Service.UserService)
    .to(UserService);
  container
    .bind<IOfferService>(Service.OfferService)
    .to(OfferService);

  return container;
}
