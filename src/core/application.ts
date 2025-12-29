import express from "express";
import type { ErrorRequestHandler } from "express";
import { inject, injectable } from "inversify";

import type { IConfig } from "./config/config.interface.js";
import type { ILogger } from "./logger/logger.interface.js";
import { Service } from "./service.js";
import type { ExceptionFilter } from "./errors/exception-filter.js";

@injectable()
export class Application {
  private readonly app: express.Application;

  constructor(
    @inject(Service.Logger) private readonly logger: ILogger,
    @inject(Service.Config) private readonly config: IConfig,
    @inject(Service.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter
  ) {
    this.app = express();
  }

  public use(middleware: express.RequestHandler): void {
    this.app.use(middleware);
  }

  public useErrorHandler(handler: ErrorRequestHandler): void {
    this.app.use(handler);
  }

  public init(): void {
    this.use(express.json());
  }

  public initExceptionFilter(): void {
    this.useErrorHandler(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public start(): void {
    this.initExceptionFilter();

    const port = this.config.getPort();

    this.app.listen(port, () => {
      this.logger.info(`Сервер запущен на порту ${port}`);
    });
  }
}

