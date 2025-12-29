import pino from "pino";
import { injectable } from "inversify";

import type { ILogger } from "./logger.interface.js";

@injectable()
export class Logger implements ILogger {
  private readonly logger: pino.Logger;

  constructor() {
    const usePretty = process.env.PRETTY_LOG === "true";

    this.logger = pino({
      level: process.env.LOG_LEVEL || "info",
      transport: usePretty
        ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
        : undefined,
    });
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info({ args }, message);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn({ args }, message);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error({ args }, message);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug({ args }, message);
  }

  getLogger(): pino.Logger {
    return this.logger;
  }
}

