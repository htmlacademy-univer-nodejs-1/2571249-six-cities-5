import { Router } from "express";
import { inject, injectable } from "inversify";

import { Service } from "../../core/service.js";
import type { Controller } from "../controller.interface.js";

import type { Route } from "../route.interface.js";

@injectable()
export class UserRoute implements Route {
  constructor(
    @inject(Service.UserController) private readonly controller: Controller
  ) { }

  public getPath(): string {
    return "/users";
  }

  public getRouter(): Router {
    const router = Router();
    router.use(this.controller.getRouter());
    return router;
  }
}

