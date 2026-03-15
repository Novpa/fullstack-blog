import jwt from "jsonwebtoken";
import { UserRole } from "../dto/auth.dto";

// payload type
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// generate access token function
export const generateAccessToken = (user: TokenPayload): string => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
      issuer: "loggy",
    },
  );
};

// verify access token function
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;

  // NOTE:
  // jika token tidak valid / kadarluwarsa, jwt.verify akan melempar error
  // kita biarkan error muncul, middleware yang akan menangkapnya
};
