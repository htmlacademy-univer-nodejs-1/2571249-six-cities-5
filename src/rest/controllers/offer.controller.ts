import { Router, type Request, type Response } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";

import { Service } from "../../core/service.js";
import type { CreateOfferDto } from "../../database/dto/create-offer.dto.js";
import type { UpdateOfferDto } from "../../database/dto/update-offer.dto.js";
import type { City } from "../../types/enums.js";
import type { IOfferService } from "../../database/services/offer-service.interface.js";
import type { IUserService } from "../../database/services/user-service.interface.js";

import { Controller } from "../controller.abstract.js";
import { transformOffer, transformOfferListItem } from "../helpers/transform-offer.helper.js";

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(Service.OfferService) private readonly offerService: IOfferService,
    @inject(Service.UserService) private readonly userService: IUserService
  ) {
    super();
  }

  public getRouter(): Router {
    const router = Router();

    router.get("/", asyncHandler(this.index.bind(this)));
    router.post("/", asyncHandler(this.create.bind(this)));
    router.get("/premium", asyncHandler(this.getPremium.bind(this)));
    router.get("/:offerId", asyncHandler(this.show.bind(this)));
    router.patch("/:offerId", asyncHandler(this.update.bind(this)));
    router.delete("/:offerId", asyncHandler(this.delete.bind(this)));
    router.post("/:offerId/favorite", asyncHandler(this.addToFavorites.bind(this)));
    router.delete("/:offerId/favorite", asyncHandler(this.removeFromFavorites.bind(this)));

    return router;
  }

  private async index(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const city = req.query.city as City | undefined;

    const userId: string | undefined = undefined;
    const user = userId ? await this.userService.findById(userId) : null;
    const userFavorites = user?.favorites?.map((id) => id.toString());

    const offers = await this.offerService.findMany({ limit, city });
    const result = offers.map((offer) => transformOfferListItem(offer, userFavorites));

    this.ok(res, result);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const userId = "dummy-user-id";

    const dto: CreateOfferDto = req.body;
    const offer = await this.offerService.create({
      ...dto,
      host: userId,
    });

    const user = await this.userService.findById(userId);
    const userFavorites = user?.favorites?.map((id) => id.toString());
    this.created(res, transformOffer(offer, userFavorites));
  }

  private async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      this.notFound(res, { message: "Предложение не найдено" });
      return;
    }

    const userId: string | undefined = undefined;
    const user = userId ? await this.userService.findById(userId) : null;
    const userFavorites = user?.favorites?.map((id) => id.toString());

    this.ok(res, transformOffer(offer, userFavorites));
  }

  private async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const dto: UpdateOfferDto = req.body;

    const offer = await this.offerService.update(offerId, dto);
    if (!offer) {
      this.notFound(res, { message: "Предложение не найдено" });
      return;
    }

    const userId: string | undefined = undefined;
    const user = userId ? await this.userService.findById(userId) : null;
    const userFavorites = user?.favorites?.map((id) => id.toString());

    this.ok(res, transformOffer(offer, userFavorites));
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      this.notFound(res, { message: "Предложение не найдено" });
      return;
    }

    await this.offerService.delete(offerId);
    this.noContent(res);
  }

  private async getPremium(req: Request, res: Response): Promise<void> {
    const city = req.query.city as City;
    if (!city) {
      this.badRequest(res, { message: "Параметр city обязателен" });
      return;
    }

    const userId: string | undefined = undefined;
    const user = userId ? await this.userService.findById(userId) : null;
    const userFavorites = user?.favorites?.map((id) => id.toString());

    const offers = await this.offerService.findPremiumByCity(city);
    const result = offers.map((offer) => transformOfferListItem(offer, userFavorites));

    this.ok(res, result);
  }

  private async addToFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = "dummy-user-id";

    const offer = await this.offerService.addToFavorites(offerId, userId);
    if (!offer) {
      this.notFound(res, { message: "Предложение не найдено" });
      return;
    }

    const user = await this.userService.findById(userId);
    const userFavorites = user?.favorites?.map((id) => id.toString());
    this.ok(res, transformOfferListItem(offer, userFavorites));
  }

  private async removeFromFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = "dummy-user-id";

    const offer = await this.offerService.removeFromFavorites(offerId, userId);
    if (!offer) {
      this.notFound(res, { message: "Предложение не найдено" });
      return;
    }

    const user = await this.userService.findById(userId);
    const userFavorites = user?.favorites?.map((id) => id.toString());
    this.ok(res, transformOfferListItem(offer, userFavorites));
  }
}

