import slugify from "slugify";
import { prisma } from "../config/prisma-client.config";
import { createBlogPayload } from "../dto/blog.dto";
import type { GetAllBlogParameter, UpdateBlog } from "../types/blog.types";
import { AppError } from "../utils/AppError";
import { handlePrismaError } from "../utils/prismaErrorHandler";
import { Prisma } from "../generated/prisma/client";

export const blogService = {
  //? CREATE BLOG
  createBlog: async (payload: createBlogPayload, authorId: string) => {
    const { title, content, thumbnail } = payload;

    const baseSlug = slugify(title, { lower: true, strict: true });
    const slug = `${baseSlug}-${Math.random().toString(36).substring(7)}`;

    try {
      const newBlog = await prisma.blog.create({
        data: {
          authorId,
          title,
          content,
          slug,
          thumbnail,
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return newBlog;
    } catch (error) {
      handlePrismaError(error);
    }
  },

  getAllBlog: async ({ page, limit, search }: GetAllBlogParameter) => {
    const offset = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        {
          title: { contains: search, mode: "insensitive" },
          content: { contains: search, mode: "insensitive" },
        },
      ];
    }

    try {
      const [blogs, count] = await prisma.$transaction([
        prisma.blog.findMany({
          skip: offset,
          take: limit,
          where,
          include: {
            author: {
              select: { firstName: true, lastName: true },
            },
          },
        }),
        prisma.blog.count({ where }),
      ]);

      const totalPage = Math.ceil(count / limit);

      return { blogs, totalData: count, totalPage };
    } catch (error) {
      handlePrismaError(error);
    }
  },
};

// export const blogService = {

// //? UPDATE BLOG
// updateBlog: async ({ blogId, newData, authorId }: UpdateBlog) => {
//   try {
//     // akan langsung throw ke catch block jika blog details tidak ada
//     const blogDetails = await prisma.blog.findFirstOrThrow({
//       where: { id: blogId, deletedAt: null },
//     });

//     // Simple author auth
//     if (blogDetails.authorId !== authorId) {
//       throw new AppError(403, "Unauthorized user");
//     }

//     const updatedBlog = await prisma.blog.update({
//       where: { id: blogId },
//       data: newData,
//     });

//     return updatedBlog;
//   } catch (error) {
//     handlePrismaError(error);
//   }
// },

// //? DELETE BLOG VALIDATION
// deleteBlog: async (blogId: string, authorId: string) => {
//   const currentDate = new Date();

//   try {
//     const blogDetails = await prisma.blog.findUniqueOrThrow({
//       where: { id: blogId, deletedAt: null },
//     });

//     //simple auth (belum menggunakan jwt)
//     if (blogDetails.authorId !== authorId) {
//       throw new AppError(401, "Unauthorized user");
//     }

//     await prisma.blog.update({
//       where: {
//         id: blogId,
//       },
//       data: {
//         deletedAt: currentDate,
//       },
//     });
//   } catch (error) {
//     handlePrismaError(error);
//   }
// },

// //? GET BLOG BY ID
// getBlogById: async (blogId: string) => {
//   try {
//     const blogDetails = await prisma.blog.findUnique({
//       where: { id: blogId, deletedAt: null },
//     });
//     return blogDetails;
//   } catch (error) {
//     handlePrismaError(error);
//   }
// },

// //? GET ALL BLOG
// getAllBlogs: async ({ page, limit, search }: GetAllBlogParameter) => {
//   const offset = (page - 1) * limit;

//   const where: Prisma.BlogWhereInput = {
//     deletedAt: null,
//   };

//   //Search by title / blogBody
//   if (search) {
//     where.OR = [
//       { title: { contains: search, mode: "insensitive" } },
//       { blogBody: { contains: search, mode: "insensitive" } },
//     ];
//   }

// TRY-CATCH
//     try {
//       const allBlog = await prisma.blog.findMany({
//         take: limit,
//         skip: offset,
//         where,
//         select: {
//           id: true,
//           author: { select: { firstName: true, lastName: true } },
//           title: true,
//           blogBody: true,
//         },
//       });

//       const totalData = await prisma.blog.count({ where });

//       return {
//         allBlog,
//         totalData,
//         currentPage: page,
//         totalPage: Math.ceil(totalData / limit),
//       };
//     } catch (error) {
//       handlePrismaError(error);
//     }
//   },
// };
