import type { DocumentType } from "@typegoose/typegoose";

import type { CreateCommentDto } from "../dto/create-comment.dto.js";
import type { CommentEntity } from "../models/comment.entity.js";

import type { BaseService } from "./base-service.interface.js";

export interface ICommentService extends Omit<BaseService<DocumentType<CommentEntity>>, "create"> {
  create(data: CreateCommentDto & { author: string; offer: string }): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string, limit?: number): Promise<DocumentType<CommentEntity>[]>;
  countByOfferId(offerId: string): Promise<number>;
}

