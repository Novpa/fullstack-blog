import jwt from "jsonwebtoken";
// import { UserRole } from "../dto/auth.dto";
import crypto from "crypto";
import { prisma } from "../config/prisma-client.config";
import { Role } from "../generated/prisma/enums";
// import prisma from "../config/prisma-client.config";

// payload type
export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
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

// Refresh token
// Berumur panjang (7 hari). DISIMPAN di database sehingga bisa
// dicabut (revoke) kapan saja — ini yang membedakannya dari Access Token.
// Bentuknya string acak, bukan JWT, karena kita tidak butuh decode payload-nya.
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(64).toString("hex");
  // 64 bytes random = 128 karakter hex = sangat sulit ditebak

  const expiratesAt = new Date();
  expiratesAt.setDate(expiratesAt.getDate() + 7); // 7 hari dari sekarang

  await prisma.refreshToken.create({
    data: { token, userId, expiratesAt },
  });

  return token;
};

export const rotateRefreshToken = async (
  oldToken: string,
  userId: string,
): Promise<string> => {
  // Operasi ini harus "atomic" — hapus lama DAN buat baru dalam satu transaksi
  // Kalau salah satu gagal, keduanya dibatalkan (tidak ada state setengah-setengah)

  const newToken = crypto.randomBytes(64).toString("hex");

  const expiratesAt = new Date();
  expiratesAt.setDate(expiratesAt.getDate() + 7);

  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { token: oldToken } }),
    prisma.refreshToken.create({
      data: { token: newToken, userId, expiratesAt },
    }),
  ]);

  return newToken;
};

//Digunakan saat logout atau saat mendeteksi pencurian token
export const revokeTokem = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};
