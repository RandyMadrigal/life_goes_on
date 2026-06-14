import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

type TokenInput = Omit<TokenPayload, "iat" | "exp">;

export const generateAccessToken = (payload: TokenInput): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: TokenInput): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

// Uses jwt.decode (no signature check) so it works even on expired tokens.
export const getTokenExpiry = (token: string): Date => {
  const decoded = jwt.decode(token) as TokenPayload | null;
  if (!decoded?.exp) throw new Error("Token has no expiry claim");
  return new Date(decoded.exp * 1000);
};
