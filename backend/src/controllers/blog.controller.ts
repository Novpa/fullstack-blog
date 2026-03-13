import { NextFunction, Request, Response } from "express";
import { blogService } from "../services/blog.service";
import { catchAsync } from "../utils/catchAsync";
// import { AppError } from "../utils/AppError";

export const blogController = {
  //? CREATE BLOG
  createBlog: catchAsync(async (req: Request, res: Response) => {
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
  }),

  //? UPDATE BLOG
  updateBlog: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const blogId = req.params.blogId as string;
      const authorId = req.query.authorId as string; //FIXME - haven't used jwt
      const newData = req.body;

      const newBlog = await blogService.updateBlog({
        blogId,
        newData,
        authorId,
      });

      res.status(202).json({
        success: true,
        message: "Blog updated successfully",
        data: {
          title: newBlog?.title,
          blogBody: newBlog?.blogBody,
        },
      });
    },
  ),

  //? GET BLOG BY ID
  getBlogById: catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;
    const blogDetails = await blogService.getBlogById(blogId);

    res.status(200).json({
      success: true,
      message: "Fectch blog details successful",
      data: {
        blogDetails,
      },
    });
  }),

  //? GET ALL BLOG
  getAllBlog: catchAsync(async (req: Request, res: Response) => {
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
  }),

  //? DELETE BLOG (SOFT DELETE)
  deleteBlog: catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;
    const authorId = req.query.authorId as string; //FIXME - haven't used jwt

    console.log(blogId, authorId);
    await blogService.deleteBlog(blogId, authorId);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  }),
};
