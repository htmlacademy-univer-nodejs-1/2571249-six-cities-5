import { Router } from "express";
import { inject, injectable } from "inversify";

import { Service } from "../../core/service.js";
import type { Controller } from "../controller.interface.js";

import type { Route } from "../route.interface.js";

@injectable()
export class OfferRoute implements Route {
  constructor(
    @inject(Service.OfferController) private readonly controller: Controller
  ) { }

  public getPath(): string {
    return "/offers";
  }

  public getRouter(): Router {
    const router = Router();
    router.use(this.controller.getRouter());
    return router;
  }
}

