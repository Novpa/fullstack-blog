import { Request, Response, NextFunction } from "express";
import { TokenPayload, verifyAccessToken } from "../utils/token.util";

// tambahkan property 'user' ke tipe request bawaan express
// Ini agar TypeScript tidak complain saat kita akses req.user di handler
// Kirim user data thru req (not from the body) for security reason
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// MIDDLEWARE 1: authenticate
// Tujuan: "Siapa yang mengirim request ini?"
// Dijalankan di SETIAP route yang membutuhkan login

export function authentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization; // ambil req.header specifiknya bagian authorization

  // check apakah ada authHeader atau apakah authHeader isi kata Bearer di depan
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is not found or false",
    });
  }

  const token = authHeader.split(" ")[1]; // Ambil data setelah kata bearer

  try {
    // verifyAccessToken() akan throw error jika:
    // - Token expired (JsonWebTokenError: jwt expired)
    // - Signature tidak valid (JsonWebTokenError: invalid signature)
    // - Format rusak (JsonWebTokenError: jwt malformed)

    const payload = verifyAccessToken(token);

    // Sisipkan payload ke object request
    // Handler selanjutnya bisa baca: req.user.userId, req.user.role, dll.

    req.user = payload;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
        code: "TOKEN_EXPIRED", // Client bisa cek kode ini untuk trigger refresh
      });
    }
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
}
