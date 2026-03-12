// import { Prisma } from "@prisma/client";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "./AppError";

export const handlePrismaError = (error: any) => {
  // A. Error yang berasal dari Database (Known Request)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        const target =
          (error.meta?.target as string[])?.join(", ") || "field tersebut";
        throw new AppError(400, `Data sudah digunakan pada: ${target}`);

      case "P2025":
        throw new AppError(404, "Data tidak ditemukan di sistem.");

      case "P2003":
        throw new AppError(
          400,
          "Gagal memproses. Data ini masih terkait dengan data lainnya.",
        );

      case "P2000":
        throw new AppError(400, "Input terlalu panjang untuk kolom ini.");

      case "P2011":
        throw new AppError(400, "Field wajib tidak boleh kosong.");

      default:
        throw new AppError(500, `Database Error (${error.code})`);
    }
  }

  // B. Error Validasi Skema (Salah tipe data/struktur)
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new AppError(400, "Struktur data yang dikirim tidak valid.");
  }

  // C. Error Koneksi Database
  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new AppError(
      503,
      "Gagal menyambung ke database. Silakan coba lagi nanti.",
    );
  }

  // D. Error Tak Terduga Lainnya
  throw new AppError(
    500,
    error.message || "Terjadi kesalahan internal pada server.",
  );
};
