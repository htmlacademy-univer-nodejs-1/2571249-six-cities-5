import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";

import { Service } from "../service.js";
import type { ILogger } from "../logger/logger.interface.js";
import { HttpError } from "./http-error.js";

@injectable()
export class ExceptionFilter {
  constructor(
    @inject(Service.Logger) private readonly logger: ILogger
  ) { }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (res.headersSent) {
      return;
    }

    if (error instanceof HttpError) {
      this.handleHttpError(error, res);
    } else {
      this.handleServerError(error, res);
    }
  }

  private handleHttpError(error: HttpError, res: Response): void {
    this.logger.warn(
      `[${error.statusCode}] ${error.message}`,
      error.details
    );

    const response: { message: string; details?: unknown } = {
      message: error.message,
    };

    if (error.details) {
      response.details = error.details;
    }

    res.status(error.statusCode).json(response);
  }

  private handleServerError(error: Error, res: Response): void {
    this.logger.error(
      `[${StatusCodes.INTERNAL_SERVER_ERROR}] ${error.message}`,
      error.stack
    );

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Внутренняя ошибка сервера",
    });
  }
}

