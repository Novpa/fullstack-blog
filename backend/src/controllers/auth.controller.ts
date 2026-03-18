import { Request, Response } from "express";
import { authServices } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";

export const authController = {
  userRegister: catchAsync(async (req: Request, res: Response) => {
    const { firstName, lastName, email, role, password } = req.body;

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

  userLogin: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const data = await authServices.userLogin({ email, password });
    res.status(200).json({
      sucessful: true,
      message: "Login successful",
      data: {
        data,
      },
    });
  }),
};
