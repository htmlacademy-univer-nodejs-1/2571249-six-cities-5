import mongoose from "mongoose";
import { inject, injectable } from "inversify";

import { Service } from "../core/service.js";
import type { ILogger } from "../core/logger/logger.interface.js";
import type { IConfig } from "../core/config/config.interface.js";

@injectable()
export class DatabaseClient {
  constructor(
    @inject(Service.Logger) private readonly logger: ILogger,
    @inject(Service.Config) private readonly config: IConfig
  ) { }

  public async connect(): Promise<void> {
    const dbHost = this.config.getDbHost();
    const dbPort = this.config.getDbPort();
    const dbName = this.config.getDbName();
    const dbUser = this.config.getDbUser();
    const dbPassword = this.config.getDbPassword();

    if (!dbHost || !dbPort || !dbName || !dbUser || !dbPassword) {
      throw new Error(
        "Не указаны все необходимые параметры подключения к базе данных: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD"
      );
    }

    const uri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
    const logUri = `mongodb://${dbUser}:***@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

    this.logger.info(`Попытка подключения к базе данных: ${logUri}`);

    try {
      await mongoose.connect(uri);
      this.logger.info("Соединение с базой данных установлено");
    } catch (error) {
      this.logger.error(
        `Ошибка при подключении к базе данных: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info("Соединение с базой данных закрыто");
    } catch (error) {
      this.logger.error(
        `Ошибка при закрытии соединения с базой данных: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }
}

