import { prisma } from "../config/prisma-client.config";
import { CreateUserPayload } from "../dto/auth.dto";
import { Prisma, Role } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { handlePrismaError } from "../utils/prismaErrorHandler";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
} from "../utils/token.util";
import { error } from "node:console";

const SALT_ROUNDS = 12;

export const authServices = {
  //? CREATE USER
  async register({
    firstName,
    lastName,
    email,
    role,
    password,
  }: CreateUserPayload) {
    try {
      // 1) Normalisasi email (lowercase) sebelum cek duplikat
      const lowerCaseEmail = email.toLowerCase().trim();

      // 2. Cek apakah email sudah terdaftar
      const existing = await prisma.user.findUnique({
        where: { email: lowerCaseEmail },
      });

      if (existing) {
        throw new AppError(409, "Email has been registered");
      }

      // 3. Hash password — ini proses ASYNC yang butuh waktu (bcrypt sengaja lambat)
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: lowerCaseEmail,
          role,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? GET ALL USER
  async getAllUser({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) {
    try {
      const offset = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {
        deletedAt: null,
      };

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { id: { contains: search, mode: "insensitive" } },
        ];
      }

      const user = await prisma.user.findMany({
        take: limit,
        skip: offset,
        where,
      });

      const totalData = await prisma.user.count({
        where,
      });

      return { user, totalData, totalPage: Math.ceil(totalData / limit) };
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? LOGIN
  async userLogin({ email, password }: { email: string; password: string }) {
    try {
      const lowerCaseEmail = email.toLowerCase().trim();

      // 1) Cari user
      const user = await prisma.user.findUnique({
        where: {
          email: lowerCaseEmail,
        },
      });

      if (!user) {
        throw new AppError(404, "Invalid credentials");
      }

      // 2) Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new AppError(404, "Invalid credentials");
      }

      // 3) Jika token benar, generate access token & refresh token
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = await generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? REFRESH TOKEN
  async refreshToken(oldRefreshToken: string) {
    // 1) cari token di database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    // 2. Token tidak ditemukan — ada dua kemungkinan:
    //    a) Token sudah expired dan dibersihkan dari DB
    //    b) TOKEN REUSE! — token ini sudah pernah dipakai sebelumnya
    //       Ini sinyal kuat bahwa refresh token telah dicuri

    if (!storedToken) {
      throw new AppError(401, "Invalid refresh token");
    }

    // 3) check apakah token sudah expired?
    if (storedToken.expiratesAt < new Date()) {
      // Bersihkan token expired ini dari DB
      await prisma.refreshToken.delete({
        where: { token: oldRefreshToken },
      });
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    // 4) jika token valid maka lakukan rotasi
    //    Hapus yang lama, buat yang baru (dalam satu transaksi)
    const newRefreshToken = await rotateRefreshToken(
      oldRefreshToken,
      storedToken.userId,
    );

    const newAccessToken = generateAccessToken({
      userId: storedToken.userId,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    return { newRefreshToken, newAccessToken };
  },
};
