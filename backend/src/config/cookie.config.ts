import { CookieOptions } from "express";

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // xss protections
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
};
