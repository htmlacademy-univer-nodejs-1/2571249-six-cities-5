import "reflect-metadata";
import { Container } from "inversify";
import { Logger } from "./logger/logger.js";
import { Config } from "./config/config.js";
import { Application } from "./application.js";
import { Service } from "./service.js";

export function createContainer(): Container {
  const container = new Container();

  container.bind<Logger>(Service.Logger).to(Logger).inSingletonScope();
  container.bind<Config>(Service.Config).to(Config).inSingletonScope();
  container
    .bind<Application>(Service.Application)
    .to(Application)
    .inSingletonScope();

  return container;
}

