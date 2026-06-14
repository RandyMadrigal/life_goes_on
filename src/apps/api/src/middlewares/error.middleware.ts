import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
      ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    });
    return;
  }

  // Mongoose duplicate key error
  if ("code" in err && (err as NodeJS.ErrnoException).code === "11000") {
    res.status(409).json({ success: false, message: "Duplicate entry" });
    return;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
