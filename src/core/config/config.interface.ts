export interface IConfig {
  getPort(): number;
  getDbHost(): string;
  getSalt(): string;
}

export interface ConfigSchema {
  port: number;
  dbHost: string;
  salt: string;
}

