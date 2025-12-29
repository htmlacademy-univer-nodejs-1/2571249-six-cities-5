import type { DocumentType } from "@typegoose/typegoose";

import type { UserEntity } from "../../database/models/user.entity.js";

export function transformUser(user: DocumentType<UserEntity>): {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPro: boolean;
} {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isPro: user.isPro,
  };
}

