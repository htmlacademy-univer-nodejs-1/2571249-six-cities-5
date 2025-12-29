import { Router, type Request, type Response } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";

import { Service } from "../../core/service.js";
import type { CreateUserDto } from "../../database/dto/create-user.dto.js";
import type { LoginUserDto } from "../../database/dto/login-user.dto.js";
import type { IOfferService } from "../../database/services/offer-service.interface.js";
import type { IUserService } from "../../database/services/user-service.interface.js";

import { Controller } from "../controller.abstract.js";
import { transformUser } from "../helpers/transform-user.helper.js";
import { transformOfferListItem } from "../helpers/transform-offer.helper.js";

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Service.UserService) private readonly userService: IUserService,
    @inject(Service.OfferService) private readonly offerService: IOfferService
  ) {
    super();
  }

  public getRouter(): Router {
    const router = Router();

    router.post("/", asyncHandler(this.create.bind(this)));
    router.post("/login", asyncHandler(this.login.bind(this)));
    router.get("/login", asyncHandler(this.checkAuth.bind(this)));
    router.post("/logout", asyncHandler(this.logout.bind(this)));
    router.get("/favorites", asyncHandler(this.getFavorites.bind(this)));

    return router;
  }

  private async create(req: Request, res: Response): Promise<void> {
    const dto: CreateUserDto = req.body;

    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      this.conflict(res, { message: "Пользователь с таким email уже существует" });
      return;
    }

    const user = await this.userService.create(dto);
    this.created(res, transformUser(user));
  }

  private async login(req: Request, res: Response): Promise<void> {
    const dto: LoginUserDto = req.body;

    const user = await this.userService.verifyUser(dto);
    if (!user) {
      this.unauthorized(res, { message: "Неверный email или пароль" });
      return;
    }

    const token = "dummy-token";
    this.ok(res, { token });
  }

  private async checkAuth(_req: Request, res: Response): Promise<void> {
    this.unauthorized(res, { message: "Требуется аутентификация" });
  }

  private async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res);
  }

  private async getFavorites(_req: Request, res: Response): Promise<void> {
    const userId = "dummy-user-id";

    const offers = await this.offerService.findFavorites(userId);
    const user = await this.userService.findById(userId);
    const userFavorites = user?.favorites?.map((id) => id.toString());
    const result = offers.map((offer) => transformOfferListItem(offer, userFavorites));

    this.ok(res, result);
  }
}

