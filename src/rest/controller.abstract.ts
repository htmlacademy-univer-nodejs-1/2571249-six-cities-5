import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export abstract class Controller {
  protected send<T>(res: Response, statusCode: number, data: T): void {
    res.status(statusCode).json(data);
  }

  protected ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  protected created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  protected noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }

  protected badRequest<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.BAD_REQUEST, data);
  }

  protected unauthorized<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.UNAUTHORIZED, data);
  }

  protected forbidden<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.FORBIDDEN, data);
  }

  protected notFound<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_FOUND, data);
  }

  protected conflict<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CONFLICT, data);
  }

  protected internalServerError<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.INTERNAL_SERVER_ERROR, data);
  }
}

