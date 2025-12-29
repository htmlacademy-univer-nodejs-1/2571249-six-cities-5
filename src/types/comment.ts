import type { User } from "./user.js";

export interface Comment {
  text: string;
  publicationDate: string;
  rating: number;
  author: User;
}

