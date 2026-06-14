import type { Mood } from "../../interfaces/IUser";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  mood: Mood;
  preferredEmailTime: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  mood: Mood;
  moodChangedAt: Date[];
  preferredEmailTime: string;
  createdAt: Date;
}

export interface IAuthService {
  register(dto: RegisterDto): Promise<{ user: SafeUser; tokens: AuthTokens }>;
  login(dto: LoginDto): Promise<{ user: SafeUser; tokens: AuthTokens }>;
  logout(refreshToken: string, accessToken: string): Promise<void>;
  refreshTokens(refreshToken: string): Promise<AuthTokens>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
