import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authController.getAllUser);
router.post("/signup", authController.userRegister);
router.post("/login", authController.userLogin);
router.post("/logout", authentication, authController.logout);

export default router;
