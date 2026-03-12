import { Router } from "express";
import { blogController } from "../controllers/blog.controller";

const router = Router();

router.post("/new", blogController.createBlog);
router.patch("/:blogId", blogController.updateBlog);
router.get("/:blogId", blogController.getBlogById);
router.get("/", blogController.getAllBlog);
router.delete("/delete/:blogId", blogController.deleteBlog);

export default router;
