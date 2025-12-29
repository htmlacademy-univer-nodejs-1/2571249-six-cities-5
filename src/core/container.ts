import "reflect-metadata";
import { Container } from "inversify";

import { Application } from "./application.js";
import { Config } from "./config/config.js";
import { DatabaseClient } from "../database/database.js";
import { Logger } from "./logger/logger.js";
import { ExceptionFilter } from "./errors/exception-filter.js";
import { CommentService } from "../database/services/comment-service.js";
import { OfferService } from "../database/services/offer-service.js";
import { UserService } from "../database/services/user-service.js";
import { OfferController } from "../rest/controllers/offer.controller.js";
import { UserController } from "../rest/controllers/user.controller.js";
import { OfferRoute } from "../rest/routes/offer.route.js";
import { UserRoute } from "../rest/routes/user.route.js";

import type { IConfig } from "./config/config.interface.js";
import type { ILogger } from "./logger/logger.interface.js";
import type { ICommentService } from "../database/services/comment-service.interface.js";
import type { IOfferService } from "../database/services/offer-service.interface.js";
import type { IUserService } from "../database/services/user-service.interface.js";
import type { Controller } from "../rest/controller.interface.js";
import type { Route } from "../rest/route.interface.js";

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
  container
    .bind<ICommentService>(Service.CommentService)
    .to(CommentService);
  container
    .bind<Controller>(Service.UserController)
    .to(UserController);
  container
    .bind<Controller>(Service.OfferController)
    .to(OfferController);
  container
    .bind<Route>(Service.UserRoute)
    .to(UserRoute);
  container
    .bind<Route>(Service.OfferRoute)
    .to(OfferRoute);
  container
    .bind<ExceptionFilter>(Service.ExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();

  return container;
}
