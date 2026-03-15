import { Request, Response } from "express";
import { authServices } from "../services/auth.service";

export const authController = {
  async userRegister(req: Request, res: Response) {
    const { firstName, lastName, email, role, password } = req.body;

    await authServices.register({ firstName, lastName, email, role, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        firstName,
        lastName,
      },
    });
  },

  async getAllUser(req: Request, res: Response) {
    //? Check the queries
    //? if undefined --> use default value
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (isNaN(page) || isNaN(limit)) {
      throw new Error("query : page & limit should be type of number");
    }

    const { user, totalData, currentPage } = await authServices.getAllUser({
      page,
      limit,
    });

    console.log(user);

    res.status(200).json({
      success: true,
      message: "Fetch user data successfull",
      data: { user, totalData, currentPage },
    });
  },

  async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await authServices.userLogin({ email, password });
    res.status(200).json({
      sucessful: true,
      message: "Login successful",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
    });
  },
};
