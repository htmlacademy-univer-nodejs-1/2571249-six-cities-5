export interface CreateUserDto {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  isPro: boolean;
}

