import { NextFunction, Request, Response } from "express";
// import { error } from "node:console";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
