import { Request, Response } from "express";
import { authServices } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { revokeToken } from "../utils/token.util";
// import { env } from "../../";

// Konfigurasi cookie yang sama dipakai di beberapa tempat — definisikan sekali
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true, // Tidak bisa diakses document.cookie di browser
  secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
  sameSite: "strict" as const, // Blokir cross-site request (anti-CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
  path: "/api/auth", // Cookie hanya dikirim ke path /api/auth — lebih aman
};

export const authController = {
  //? REGISTER
  userRegister: catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, email, role, password } = req.body;

    if (!firstName || !lastName || !email || !role || !password) {
      return res
        .status(408)
        .json({ success: false, message: "All forms should be filled" });
    }

    if (password.length < 8) {
      return res.status(408).json({
        success: false,
        message: "Password at least has 8 characters",
      });
    }
    const user = await authServices.register({
      firstName,
      lastName,
      email,
      role,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user,
      },
    });
  }),

  //? LOGIN
  userLogin: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(408)
        .json({ success: false, message: "All forms should be filled" });
    }

    const data = await authServices.userLogin({ email, password });

    const refreshToken = data?.refreshToken;
    const accessToken = data?.accessToken;
    const user = data?.user;

    // Refresh Token dikirim via HttpOnly Cookie — TIDAK boleh di body response
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      sucessful: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  }),

  //? REFRESH
  // will be hit by front-end once they have 401 response code : "TOKEN_EXPIRED"
  async refresh(req: Request, res: Response) {
    try {
      // ambil refresh token dari cookie
      const oldRefreshToken = req.cookies.refreshToken;
      console.log("oldRefreshToken", oldRefreshToken);

      if (!oldRefreshToken) {
        return res
          .status(401)
          .json({ success: false, message: "Refresh token is not found" });
      }

      // create new accessToken & new refreshToken
      const { newAccessToken, newRefreshToken } =
        await authServices.refreshToken(oldRefreshToken);

      // store new token in the cookie
      res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

      return res.status(200).json({
        success: true,
        data: { accessToken: newAccessToken },
      });
    } catch (error: any) {
      // hapus cookie yang invalid
      res.clearCookie("refreshToken", { path: "/auth" });
      const message =
        error.message === "REFRESH_TOKEN_EXPIRED"
          ? "Your session has finished, re-login"
          : "Refresh token is not valid, re-login";

      return res.status(401).json({ success: false, message });
    }
  },

  //? LOGOUT
  logout: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Hapus token ini dari database — token tidak bisa dipakai lagi
      // Berbeda dengan JWT biasa yang tidak bisa di-revoke
      await revokeToken((req as any).user!.userId); // req didapatkan dari auth middleware setelah user verified
    }

    // clear cookie from the browser
    res.clearCookie("refreshToken", { path: "/auth" });

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  }),

  //? GET ALL USERS
  getAllUser: catchAsync(async (req: Request, res: Response) => {
    //? Check the queries
    //? if undefined --> use default value
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;

    const data = await authServices.getAllUser({
      page,
      limit,
      search,
    });

    res.status(200).json({
      success: true,
      message: "Fetch user data successfull",
      data: {
        user: data?.user,
        totalData: data?.totalData,
        totalPage: data?.totalPage,
      },
    });
  }),
};
