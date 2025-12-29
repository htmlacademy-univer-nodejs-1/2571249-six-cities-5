export interface IConfig {
  getPort(): number;
  getDbHost(): string;
  getDbPort(): number;
  getDbName(): string;
  getDbUser(): string;
  getDbPassword(): string;
  getSalt(): string;
}

export interface ConfigSchema {
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  salt: string;
}

