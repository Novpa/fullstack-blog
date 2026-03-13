export class AppError extends Error {
  public readonly statusCode: number;
  // public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // this.isOperational = isOperational;

    // Supaya instanceof bekerja dengan benar di TypeScript
    // Object.setPrototypeOf(this, new.target.prototype);
    // Error.captureStackTrace(this); // Ini berguna untuk Debugging. Baris ini memerintahkan program untuk mencatat di file mana dan baris ke berapa error ini terjadi,
  }
}
