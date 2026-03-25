import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import {
  registerUser,
  rotateToken,
  validateUser,
} from "../services/auth.service";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import { prisma } from "../config/prisma-client.config";
import { REFRESH_COOKIE_OPTIONS } from "../config/cookie.config";
import { AppError } from "../utils/AppError";

//? signup
export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    message: "User is successfully created",
    data: user,
  });
});

//? signin
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1) validate user
  const user = await validateUser(email, password);

  // 2) prepare payload for jwt
  const payload = {
    userId: user.id,
    role: user.role,
    fullName: `${user.firstName} ${user.lastName}`,
  };

  // 3) generate both tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 4) save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 5) send refresh token to client via cookie and access token via response/body
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      user,
    },
  });
});

//? refresh
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new AppError(401, "Sesi berakhir, silakan login kembali.");
  }

  // 1) verification JWT token (expires & secret)
  const decoded = verifyRefreshToken(oldRefreshToken);

  // 2) search in database, if it's still active
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: true },
  });

  // 3) if jwt is valid but is not stored in the DB
  if (!storedToken) {
    // delete all refresh token token that is belong to user in the DB (Security Breach)
    await prisma.refreshToken.deleteMany({ where: { userId: decoded.userId } });
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    throw new AppError(401, "Suspicious activities are detected");
  }

  // 4) prepare new payload
  const payload = {
    userId: storedToken.user.id,
    role: storedToken.user.role,
    fullName: `${storedToken.user.firstName} ${storedToken.user.lastName}`,
  };

  // 5) do rotations in the service
  const newAccessToken = generateAccessToken(payload);
  const rotateSession = await rotateToken(oldRefreshToken, payload);

  // 6) send to the client
  res.cookie("refreshToken", rotateSession.token, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    status: "success",
    data: { accessToken: newAccessToken },
  });
});

// export const authController = {
//   //? REGISTER
//   userRegister: catchAsync(async (req: Request, res: Response) => {
//     const { firstName, lastName, email, role, password } = req.body;

//     if (!firstName || !lastName || !email || !role || !password) {
//       return res
//         .status(408)
//         .json({ success: false, message: "All forms should be filled" });
//     }

//     if (password.length < 8) {
//       return res.status(408).json({
//         success: false,
//         message: "Password at least has 8 characters",
//       });
//     }
//     const user = await authServices.register({
//       firstName,
//       lastName,
//       email,
//       role,
//       password,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: {
//         user,
//       },
//     });
//   }),

//   //? LOGIN
//   userLogin: catchAsync(async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(408)
//         .json({ success: false, message: "All forms should be filled" });
//     }

//     const data = await authServices.userLogin({ email, password });

//     const refreshToken = data?.refreshToken;
//     const accessToken = data?.accessToken;
//     const user = data?.user;

//     // Refresh Token dikirim via HttpOnly Cookie — TIDAK boleh di body response
//     res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

//     res.status(200).json({
//       sucessful: true,
//       message: "Login successful",
//       data: {
//         accessToken,
//         user,
//       },
//     });
//   }),

//   //? REFRESH
//   // will be hit by front-end once they have 401 response code : "TOKEN_EXPIRED"
//   async refresh(req: Request, res: Response) {
//     console.log("Cookie yang diterima:", req.cookies.refreshToken);
//     try {
//       // ambil refresh token dari cookie
//       const oldRefreshToken = req.cookies.refreshToken;

//       if (!oldRefreshToken) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Refresh token is not found" });
//       }

//       // create new accessToken & new refreshToken
//       const data = await authServices.refreshToken(oldRefreshToken);
//       const newRefreshToken = data?.newRefreshToken;
//       const newAccessToken = data?.newAccessToken;
//       const user = data?.user;

//       console.log(
//         "new refresh controller",
//         newRefreshToken,
//         newAccessToken,
//         user,
//       );

//       // store new token in the cookie
//       res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

//       return res.status(200).json({
//         success: true,
//         data: { accessToken: newAccessToken, user },
//       });
//     } catch (error: any) {
//       // Hanya hapus cookie jika error memang karena token bermasalah
//       if (error.message === "REFRESH_TOKEN_EXPIRED" || error.status === 401) {
//         res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
//       }

//       const message =
//         error.message === "REFRESH_TOKEN_EXPIRED"
//           ? "Your session has finished, re-login"
//           : "Refresh token is not valid, re-login";

//       // Gunakan status 401 untuk auth error, 500 untuk error server internal
//       const statusCode = error.message === "REFRESH_TOKEN_EXPIRED" ? 401 : 500;

//       return res.status(statusCode).json({ success: false, message });
//     }
//   },

//   //? LOGOUT
//   logout: catchAsync(async (req: Request, res: Response) => {
//     const refreshToken = req.cookies.refreshToken;

//     if (refreshToken) {
//       // Hapus token ini dari database — token tidak bisa dipakai lagi
//       // Berbeda dengan JWT biasa yang tidak bisa di-revoke
//       await revokeToken((req as any).user!.userId); // req didapatkan dari auth middleware setelah user verified
//     }

//     // clear cookie from the browser
//     res.clearCookie("refreshToken", { path: "/" });

//     return res
//       .status(200)
//       .json({ success: true, message: "Logout successful" });
//   }),

//   //? GET ALL USERS
//   getAllUser: catchAsync(async (req: Request, res: Response) => {
//     //? Check the queries
//     //? if undefined --> use default value
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const search = req.query.search as string;

//     const data = await authServices.getAllUser({
//       page,
//       limit,
//       search,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Fetch user data successfull",
//       data: {
//         user: data?.user,
//         totalData: data?.totalData,
//         totalPage: data?.totalPage,
//       },
//     });
//   }),
// };
