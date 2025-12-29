import { inject, injectable } from "inversify";
import type { DocumentType } from "@typegoose/typegoose";

import { Service } from "../../core/service.js";
import type { CreateCommentDto } from "../dto/create-comment.dto.js";
import { CommentModel, type CommentEntity } from "../models/comment.entity.js";

import type { ICommentService } from "./comment-service.interface.js";
import type { IOfferService } from "./offer-service.interface.js";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(Service.OfferService) private readonly offerService: IOfferService
  ) { }

  public async findById(id: string): Promise<DocumentType<CommentEntity> | null> {
    // @ts-ignore - typegoose type inference issue
    return (await CommentModel.findById(id).populate("author").exec()) as DocumentType<CommentEntity> | null;
  }

  public async create(data: CreateCommentDto & { author: string; offer: string }): Promise<DocumentType<CommentEntity>> {
    const comment = new CommentModel({
      ...data,
      publicationDate: new Date(),
    });
    // @ts-ignore - typegoose save() type inference issue
    const savedComment = await comment.save();

    await this.offerService.incrementCommentCount(data.offer);
    await this.offerService.updateRating(data.offer);

    return savedComment;
  }

  public async findByOfferId(offerId: string, limit: number = 50): Promise<DocumentType<CommentEntity>[]> {
    return (await CommentModel.find({ offer: offerId as any })
      .populate("author")
      .sort({ publicationDate: -1 })
      .limit(limit)
      .exec()) as DocumentType<CommentEntity>[];
  }

  public async countByOfferId(offerId: string): Promise<number> {
    return CommentModel.countDocuments({ offer: offerId as any }).exec();
  }
}

