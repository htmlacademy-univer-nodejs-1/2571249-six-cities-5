import { injectable } from "inversify";

import type { DocumentType } from "@typegoose/typegoose";

import { UserModel, type UserEntity } from "../models/user.entity.js";

import type { IUserService } from "./user-service.interface.js";

@injectable()
export class UserService implements IUserService {
  async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return (await UserModel.findById(id).exec()) as DocumentType<UserEntity> | null;
  }

  async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return (await UserModel.findOne({ email }).exec()) as DocumentType<UserEntity> | null;
  }

  async create(data: Partial<UserEntity>): Promise<DocumentType<UserEntity>> {
    const user = new UserModel(data);
    // @ts-ignore - typegoose save() type inference issue
    return user.save();
  }
}

