import { injectable } from "inversify";
import type { DocumentType } from "@typegoose/typegoose";

import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { LoginUserDto } from "../dto/login-user.dto.js";
import { UserModel, type UserEntity } from "../models/user.entity.js";

import type { IUserService } from "./user-service.interface.js";

@injectable()
export class UserService implements IUserService {
  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return (await UserModel.findById(id).exec()) as DocumentType<UserEntity> | null;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return (await UserModel.findOne({ email }).exec()) as DocumentType<UserEntity> | null;
  }

  public async create(data: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserModel(data);
    // @ts-ignore - typegoose save() type inference issue
    return user.save();
  }

  public async verifyUser(data: LoginUserDto): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(data.email);
    if (!user) {
      return null;
    }

    if (user.password !== data.password) {
      return null;
    }

    return user;
  }
}

