import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "HttpError";
  }

  public static badRequest(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.BAD_REQUEST, message, details);
  }

  public static unauthorized(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.UNAUTHORIZED, message, details);
  }

  public static forbidden(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.FORBIDDEN, message, details);
  }

  public static notFound(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.NOT_FOUND, message, details);
  }

  public static conflict(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.CONFLICT, message, details);
  }

  public static internalServerError(message: string, details?: unknown): HttpError {
    return new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, message, details);
  }
}

