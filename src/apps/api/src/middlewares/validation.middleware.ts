import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

type RequestPart = "body" | "params" | "query";

export const validate = (schema: ZodSchema, part: RequestPart = "body"): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      next(ApiError.badRequest("Validation failed", errors));
      return;
    }

    // Replace raw input with the sanitized/transformed Zod output
    req[part] = result.data as Record<string, unknown>;
    next();
  };
};
