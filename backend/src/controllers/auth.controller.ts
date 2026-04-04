import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import { prisma } from "../config/prisma-client.config";
import { REFRESH_COOKIE_OPTIONS } from "../config/cookie.config";
import { AppError } from "../utils/AppError";
import { userService } from "../services/auth.service";
import { formatUserResponse } from "../utils/formatUserResponse";
import { emailService } from "../services/email.service";
import { signupBody } from "../schemas/auth.schema";

//? signup
export const signup = catchAsync(
  async (req: Request<{}, {}, signupBody>, res: Response) => {
    const user = await userService.registerUser(req.body);

    res.status(201).json({
      status: "success",
      message: "User is successfully created",
      data: user,
    });
  },
);

//? verifyOtp
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await userService.verifyOtp(email, otp);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully, you can now login",
  });
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  await userService.resendOtp(email);

  res.status(200).json({
    status: "success",
    message: "OTP has been resent, please check your email",
  });
};

//? signin
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1) validate user
  const user = await userService.validateUser(email, password);

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
  // take the token from cookie
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new AppError(401, "Your session has finished, please re-login!");
  }

  // 1) verification JWT token (expires & secret)
  const decoded = verifyRefreshToken(oldRefreshToken);

  // 2) search in database, if it's still active
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new AppError(401, "Suspicious activities are detected");
  }

  // 3) prepare new payload
  const payload = {
    userId: storedToken.user.id,
    role: storedToken.user.role,
    fullName: `${storedToken.user.firstName} ${storedToken.user.lastName}`,
  };

  // 4) do rotations in the service
  const newAccessToken = generateAccessToken(payload);
  const rotateSession = await userService.rotateToken(oldRefreshToken, payload); // note --> rotateToken fnc will generate new refresh token and generate old token in database
  const userResponse = formatUserResponse(rotateSession.user);

  // 5) send to the client
  res.cookie("refreshToken", rotateSession.token, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    status: "success",
    data: { accessToken: newAccessToken, user: userResponse },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const storedToken = req.cookies.refreshToken;

  // delete token from database
  if (storedToken) {
    await userService.logoutUser(storedToken);
  }

  // delete token from the browser
  res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});
