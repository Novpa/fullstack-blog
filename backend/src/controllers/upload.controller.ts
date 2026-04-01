import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { uploadCloudinary } from "../utils/uploadCloudinary";
import { AppError } from "../utils/AppError";

export const uploadController = {
  uploadSingle: catchAsync(async (req: Request, res: Response) => {
    console.log("file", req.file);
    console.log("path", req.file?.path);

    if (!req.file) {
      throw new AppError(400, "No file uploaded");
    }

    // const path = req.file?.path as string;

    const url = await uploadCloudinary(req.file.buffer, "blog-images");

    res.status(200).json({
      status: "success",
      data: { url },
    });
  }),
};
