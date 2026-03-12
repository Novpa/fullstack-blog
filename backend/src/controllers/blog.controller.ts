import { Request, Response } from "express";
import { blogService } from "../services/blog.service";
import { AppError } from "../utils/AppError";

export const blogController = {
  //? CREATE BLOG
  async createBlog(req: Request, res: Response) {
    const { authorId, title, blogBody } = req.body;

    const newBlog = await blogService.createBlog({ authorId, title, blogBody });
    console.log("newBlog", newBlog);
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
        title: newBlog?.title,
        blogBody: newBlog?.blogBody,
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
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;
    const search = req.query.search as string;

    const blogData = await blogService.getAllBlog({
      page,
      limit,
      search,
    });

    // if () {
    //   throw new AppError(404, "Blogs not found");
    // }

    res.status(200).json({
      success: true,
      message: "Blog data are fectched successfully",
      data: {
        currentPage: blogData?.currentPage,
        totalPage: blogData?.totalPage,
        totalData: blogData?.totalData,
        allBlog: blogData?.allBlog,
      },
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
