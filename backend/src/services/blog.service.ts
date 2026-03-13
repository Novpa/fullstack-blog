import { prisma } from "../config/prisma-client.config";
import { createBlogPayload } from "../dto/createBlog.dto";
import { Blog, Prisma } from "../generated/prisma/client";
import type { GetAllBlogParameter, UpdateBlog } from "../types/blog.types";
import { AppError } from "../utils/AppError";
import { handlePrismaError } from "../utils/prismaErrorHandler";

export const blogService = {
  //? CREATE BLOG
  createBlog: async (payload: createBlogPayload) => {
    const { authorId, title, blogBody } = payload;
    try {
      const newBlog = await prisma.blog.create({
        data: {
          authorId,
          title,
          blogBody,
        },
      });

      return newBlog;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? UPDATE BLOG
  updateBlog: async ({ blogId, newData, authorId }: UpdateBlog) => {
    try {
      // akan langsung throw ke catch block jika blog details tidak ada
      const blogDetails = await prisma.blog.findFirstOrThrow({
        where: { id: blogId, deletedAt: null },
      });

      // Simple author auth
      if (blogDetails.authorId !== authorId) {
        throw new AppError(403, "Unauthorized user");
      }

      const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: newData,
      });

      return updatedBlog;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? DELETE BLOG VALIDATION
  deleteBlog: async (blogId: string, authorId: string) => {
    const currentDate = new Date();

    try {
      const blogDetails = await prisma.blog.findUniqueOrThrow({
        where: { id: blogId, deletedAt: null },
      });

      //simple auth (belum menggunakan jwt)
      if (blogDetails.authorId !== authorId) {
        throw new AppError(401, "Unauthorized user");
      }

      await prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          deletedAt: currentDate,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? GET BLOG BY ID
  getBlogById: async (blogId: string) => {
    try {
      const blogDetails = await prisma.blog.findUnique({
        where: { id: blogId, deletedAt: null },
      });
      return blogDetails;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  //? GET ALL BLOG
  getAllBlogs: async ({ page, limit, search }: GetAllBlogParameter) => {
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
