import { Request, Response } from "express";
import { blogService } from "../services/blog.service";

export const blogController = {
  //? CREATE BLOG
  async createBlog(req: Request, res: Response) {
    const { authorId, title, blogBody } = req.body;

    await blogService.createBlog({ authorId, title, blogBody });

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      data: {
        title,
        blogBody,
      },
    });
  },

  //? UPDATE BLOG
  async updateBlog(req: Request, res: Response) {
    const blogId = req.params.blogId as string;
    const authorId = req.query.authorId as string;
    const newData = req.body;

    await blogService.updateBlogValidation(blogId, authorId);

    const newBlog = await blogService.updateBlog({ blogId, newData });

    res.status(202).json({
      success: true,
      message: "Blog updated successfully",
      data: {
        title: newBlog.title,
        blogBody: newBlog.blogBody,
      },
    });
  },

  //? GET BLOG BY ID
  async getBlogById(req: Request, res: Response) {
    const blogId = req.params.blogId as string;
    const blogDetails = await blogService.getBlogById(blogId);

    res.status(200).json({
      success: true,
      message: "Fectch blog details successful",
      data: {
        blogDetails,
      },
    });
  },

  //? GET ALL BLOG
  async getAllBlog(req: Request, res: Response) {
    const allBlog = await blogService.getAllBlog();

    res.status(200).json({
      success: true,
      message: "Blog data are fectched successfully",
      data: allBlog,
    });
  },

  //? DELETE BLOG (SOFT DELETE)
  async deleteBlog(req: Request, res: Response) {
    const blogId = req.params.blogId as string;
    const authorId = req.query.authorId as string;
    await blogService.updateBlogValidation(blogId, authorId);

    const currentDate = new Date();
    const newData = {
      deletedAt: currentDate,
    };

    await blogService.updateBlog({ blogId, newData });

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  },
};
