import { Request, Response, Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authentication, authorization } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authController.getAllUser);
router.post("/signup", authController.userRegister);
router.post("/login", authController.userLogin);
router.post("/logout", authentication, authController.logout);
router.get("/refresh", authController.refresh);

//protected route
router.get(
  "/blog/new",
  authentication,
  authorization("AUTHOR"),
  (req: Request, res: Response) => {
    res.status(200).json({
      message: "create blog",
    });
  },
);

export default router;
