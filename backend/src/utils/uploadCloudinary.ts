import { rejects } from "node:assert";
import cloudinary from "../config/cloudinary.config";
import { error } from "node:console";

export const uploadCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url); // return url cloudinary
      },
    );
    stream.end(buffer); // send buffer to cloudinary
  });
};
