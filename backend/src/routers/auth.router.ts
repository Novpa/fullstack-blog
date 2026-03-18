import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.get("/", authController.getAllUser);
router.post("/signup", authController.userRegister);
router.post("/login", authController.userLogin);

export default router;
