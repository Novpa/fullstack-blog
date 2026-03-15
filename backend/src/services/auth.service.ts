import { prisma } from "../config/prisma-client.config";
import { createUserPayload } from "../dto/auth.dto";
import { User } from "../generated/prisma/client";

export const authServices = {
  //? CREATE USER
  async register({
    firstName,
    lastName,
    email,
    role,
    password,
  }: createUserPayload) {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });
  },

  //? GET ALL USER
  async getAllUser({ page, limit }: { page: number; limit: number }) {
    const offset = (page - 1) * limit;

    const user = await prisma.user.findMany({
      take: limit,
      skip: offset,
      where: {
        deletedAt: null,
      },
    });

    return { user, totalData: user.length, currentPage: page };
  },

  //? LOGIN
  async userLogin({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return user;
  },
};
