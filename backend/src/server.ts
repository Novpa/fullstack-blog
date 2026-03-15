import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import authRouter from "./routers/auth.router";
import blogRouter from "./routers/blog.router";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

const app: Express = express();
const PORT = 8000;

app.use(express.json());

app.use("/api/user", authRouter);
app.use("/api/blog", blogRouter);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🦄 Server is running in port ${PORT}`);
});
