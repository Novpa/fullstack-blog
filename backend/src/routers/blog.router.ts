import { Router } from "express";
import { authentication, authorization } from "../middlewares/auth.middleware";
import { blogController } from "../controllers/blog.controller";
import { upload } from "../config/multer.config";
import { uploadController } from "../controllers/upload.controller";
import { validate } from "../middlewares/validation.middleware";
import { getAllBlogs } from "../schemas/blog.schema";

const router = Router();

router.get("/", validate(getAllBlogs), blogController.getAllBlog);

router.post(
  "/",
  authentication,
  authorization("AUTHOR"),
  blogController.createBlog,
);

router.post(
  "/test-upload",
  upload.single("image"),
  uploadController.uploadSingle,
);

export default router;

// router.get(
//   "/",
//   authentication,
//   authorization("AUTHOR"),
//   blogController.getAllBlog,
// );
// router.post(
//   "/",
//   authentication,
//   authorization("AUTHOR"),
//   blogController.createBlog,
// );
// router.get("/:blogId", blogController.getBlogById);
// router.patch("/:blogId", blogController.updateBlog);
// router.delete("/delete/:blogId", blogController.deleteBlog);
