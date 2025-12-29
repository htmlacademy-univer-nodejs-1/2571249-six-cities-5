import type { DocumentType } from "@typegoose/typegoose";

import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { LoginUserDto } from "../dto/login-user.dto.js";
import type { UserEntity } from "../models/user.entity.js";

import type { BaseService } from "./base-service.interface.js";

export interface IUserService extends Omit<BaseService<DocumentType<UserEntity>>, "create"> {
  create(data: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  verifyUser(data: LoginUserDto): Promise<DocumentType<UserEntity> | null>;
}

