import { Request, Response, Router } from "express";
import { authentication, authorization } from "../middlewares/auth.middleware";
import {
  login,
  logout,
  refresh,
  signup,
  verifyOtp,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.post("/verify-otp", verifyOtp);

// router.get("/", authController.getAllUser);
// router.post("/signup", authController.userRegister);
// router.post("/login", authController.userLogin);
// router.post("/logout", authentication, authController.logout);
// router.get("/refresh", authController.refresh);

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
