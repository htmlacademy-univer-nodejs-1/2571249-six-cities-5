import { inject, injectable } from "inversify";
import type { ILogger } from "./logger/logger.interface.js";
import type { IConfig } from "./config/config.interface.js";
import { Service } from "./service.js";

@injectable()
export class Application {
  constructor(
    @inject(Service.Logger) private readonly logger: ILogger,
    @inject(Service.Config) private readonly config: IConfig
  ) { }

  public init(): void {
    this.logger.info("Приложение инициализировано");
    this.logger.info(`Порт: ${this.config.getPort()}`);
  }
}

