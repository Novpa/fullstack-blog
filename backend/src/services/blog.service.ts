import { prisma } from "../config/prisma-client.config";
import { Blog, Prisma } from "../generated/prisma/client";
import type { GetAllBlogParameter, UpdateBlog } from "../types/blog.types";
import { AppError } from "../utils/AppError";
import { handlePrismaError } from "../utils/prismaErrorHandler";

export const blogService = {
  //? CREATE BLOG
  async createBlog({
    authorId,
    title,
    blogBody,
  }: Omit<Blog, "id" | "createdAt" | "updatedAt" | "deletedAt">) {
    try {
      const newBlog = await prisma.blog.create({
        data: { authorId, title, blogBody },
      });

      return newBlog;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? UPDATE BLOG
  async updateBlog({ blogId, newData }: UpdateBlog) {
    try {
      const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: newData,
      });

      return updatedBlog;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? UPDATE/DELETE BLOG VALIDATION //FIXME
  async updateBlogValidation(blogId: string, authorId: string) {
    try {
      const blogDetails = await prisma.blog.findFirst({
        where: { id: blogId },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? GET BLOG BY ID
  async getBlogById(blogId: string) {
    try {
      const blogDetails = await prisma.blog.findUnique({
        where: { id: blogId },
      });
      return blogDetails;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? GET ALL BLOG
  async getAllBlog({ page, limit, search }: GetAllBlogParameter) {
    const offset = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    //Search by title / blogBody
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { blogBody: { contains: search, mode: "insensitive" } },
      ];
    }

    // TRY-CATCH
    try {
      const allBlog = await prisma.blog.findMany({
        take: limit,
        skip: offset,
        where,
        select: {
          id: true,
          author: { select: { firstName: true, lastName: true } },
          title: true,
          blogBody: true,
        },
      });

      const totalData = await prisma.blog.count({ where });

      return {
        allBlog,
        totalData,
        currentPage: page,
        totalPage: Math.ceil(totalData / limit),
      };
    } catch (error) {
      handlePrismaError(error);
    }
  },
};
