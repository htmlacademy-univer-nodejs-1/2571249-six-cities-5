import dotenv from "dotenv";
import convict from "convict";
import convictFormatWithValidator from "convict-format-with-validator";
import { injectable } from "inversify";

import type { IConfig, ConfigSchema } from "./config.interface.js";

dotenv.config();

convict.addFormats(convictFormatWithValidator);

const configSchema = convict<ConfigSchema>({
  port: { env: "PORT", format: "port", default: 6060 },
  dbHost: { env: "DB_HOST", format: "ipaddress", default: "127.0.0.1" },
  dbPort: { env: "DB_PORT", format: "port", default: 27017 },
  dbName: { env: "DB_NAME", format: String, default: "six-cities" },
  dbUser: { env: "DB_USER", format: String, default: "" },
  dbPassword: { env: "DB_PASSWORD", format: String, default: "" },
  salt: { env: "SALT", default: "" },
});

@injectable()
export class Config implements IConfig {
  private readonly config: convict.Config<ConfigSchema>;

  constructor() {
    this.config = configSchema;
    this.config.validate({ allowed: "strict" });
  }

  getPort(): number {
    return this.config.get("port");
  }

  getDbHost(): string {
    return this.config.get("dbHost");
  }

  getDbPort(): number {
    return this.config.get("dbPort");
  }

  getDbName(): string {
    return this.config.get("dbName");
  }

  getDbUser(): string {
    return this.config.get("dbUser");
  }

  getDbPassword(): string {
    return this.config.get("dbPassword");
  }

  getSalt(): string {
    return this.config.get("salt");
  }
}

