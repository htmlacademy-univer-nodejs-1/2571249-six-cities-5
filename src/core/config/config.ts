import convict from "convict";
import convictFormatWithValidator from "convict-format-with-validator";
import { injectable } from "inversify";

import type { IConfig, ConfigSchema } from "./config.interface.js";

convict.addFormats(convictFormatWithValidator);

const configSchema = convict<ConfigSchema>({
  port: { env: "PORT", format: "port", default: 6060 },
  dbHost: { env: "DB_HOST", format: "ipaddress", default: "127.0.0.1" },
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

  getSalt(): string {
    return this.config.get("salt");
  }
}

