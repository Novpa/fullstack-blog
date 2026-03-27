import { Router } from "express";
import { blogController } from "../controllers/blog.controller";
import { authentication, authorization } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authentication,
  authorization("AUTHOR"),
  blogController.getAllBlog,
);
// router.post(
//   "/",
//   authentication,
//   authorization("AUTHOR"),
//   blogController.createBlog,
// );
// router.get("/:blogId", blogController.getBlogById);
// router.patch("/:blogId", blogController.updateBlog);
// router.delete("/delete/:blogId", blogController.deleteBlog);

export default router;
