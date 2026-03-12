import { prisma } from "../config/prisma-client.config";
import { Blog } from "../generated/prisma/client";
import type { UpdateBlog } from "../types/blog.types";

export const blogService = {
  async createBlog({
    authorId,
    title,
    blogBody,
  }: Omit<Blog, "id" | "createdAt" | "updatedAt" | "deletedAt">) {
    await prisma.blog.create({ data: { authorId, title, blogBody } });
  },

  async updateBlog({ blogId, newData }: UpdateBlog) {
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: newData,
    });

    return updatedBlog;
  },

  //? UPDATE/DELETE BLOG VALIDATION
  async updateBlogValidation(blogId: string, authorId: string) {
    const blogDetails = await prisma.blog.findFirst({ where: { id: blogId } });

    // invalid id
    if (!blogDetails) {
      throw new Error("Invalid blog id");
    }

    if (blogDetails.authorId !== authorId) {
      throw new Error(
        "Invalid credential details, only author can update the blog",
      );
    }
  },

  //? GET BLOG BY ID
  async getBlogById(blogId: string) {
    const blogDetails = await prisma.blog.findFirst({ where: { id: blogId } });

    // invalid id
    if (!blogDetails) {
      throw new Error("Invalid blog id");
    }

    return blogDetails;
  },

  async getAllBlog() {
    const allBlog = await prisma.blog.findMany({ where: { deletedAt: null } });
    // console.log("allBlog", allBlog);

    return allBlog;
  },
};
