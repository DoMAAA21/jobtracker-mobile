export type User = {
  id: number;
  email: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken?: string;
};
