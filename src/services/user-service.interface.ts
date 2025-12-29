import type { DocumentType } from "@typegoose/typegoose";

import type { UserEntity } from "../models/user.entity.js";

import type { BaseService } from "./base-service.interface.js";

export interface IUserService extends BaseService<DocumentType<UserEntity>> {
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
}

