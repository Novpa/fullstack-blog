import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums";

//? payload type
export interface TokenPayload {
  userId: string;
  role: Role;
  fullName: string;
}

//? create access token (15 mins exp)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "10s",
  });
};

//? create refresh token (7 days exp)
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

//? verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
};

//? verify refresh token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
};
