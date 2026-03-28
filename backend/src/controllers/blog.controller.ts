import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { blogService } from "../services/blog.service";

export const blogController = {
  //? create blog
  createBlog: catchAsync(async (req: Request, res: Response) => {
    const { title, content, thumbnail } = req.body;

    const authorId = req.user?.userId as string;

    const newBlog = await blogService.createBlog(
      {
        title,
        content,
        thumbnail,
      },
      authorId,
    );

    res.status(200).json({
      success: true,
      message: "Blog created successfully",
      data: {
        blog: newBlog,
      },
    });
  }),

  getAllBlog: catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;

    const result = await blogService.getAllBlog({
      page,
      limit,
      search,
    });

    const blogs = result?.blogs;
    const totalPage = result?.totalPage;
    const totalData = result?.totalData;

    res.status(200).json({
      status: "success",
      data: {
        blogs,
        totalPage,
        totalData,
      },
    });
  }),
};

// export const blogController = {
//? CREATE BLOG

// //? UPDATE BLOG
// updateBlog: catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const blogId = req.params.blogId as string;
//     const authorId = req.query.authorId as string; //FIXME - haven't used jwt
//     const newData = req.body;

//     const newBlog = await blogService.updateBlog({
//       blogId,
//       newData,
//       authorId,
//     });

//     res.status(202).json({
//       success: true,
//       message: "Blog updated successfully",
//       data: {
//         title: newBlog?.title,
//         blogBody: newBlog?.blogBody,
//       },
//     });
//   },
// ),

// //? GET BLOG BY ID
// getBlogById: catchAsync(async (req: Request, res: Response) => {
//   const blogId = req.params.blogId as string;
//   const blogDetails = await blogService.getBlogById(blogId);

//   res.status(200).json({
//     success: true,
//     message: "Fectch blog details successful",
//     data: {
//       blogDetails,
//     },
//   });
// }),

//   //? GET ALL BLOG
//   getAllBlog: catchAsync(async (req: Request, res: Response) => {
//     const page = Number(req.query?.page) || 1; // akan langsung ke kanan jika falsy
//     const limit = Number(req.query?.limit) || 10;
//     const search = req.query.search as string;

//     // console.log("testing user data from req:", req.user);

//     const blogData = await blogService.getAllBlogs({
//       page,
//       limit,
//       search,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Blog data are fectched successfully",
//       data: {
//         currentPage: blogData?.currentPage,
//         totalPage: blogData?.totalPage,
//         totalData: blogData?.totalData,
//         allBlog: blogData?.allBlog,
//       },
//     });
//   }),

//   //? DELETE BLOG (SOFT DELETE)
//   // deleteBlog: catchAsync(async (req: Request, res: Response) => {
//   //   const blogId = req.params.blogId as string;
//   //   const authorId = req.query.authorId as string; //FIXME - haven't used jwt

//   //   console.log(blogId, authorId);
//   //   await blogService.deleteBlog(blogId, authorId);

//   //   res.status(200).json({
//   //     success: true,
//   //     message: "Blog deleted successfully",
//   //   });
//   // }),
// };
