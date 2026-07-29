import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/response";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === "ZodError") {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return sendError(res, "Validation failed", 400, formattedErrors);
      }
      return sendError(res, "Invalid request payload", 400, error?.message || error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      // Express 5 query object is read-only getter. Clear and assign parsed values.
      for (const key in req.query) {
        delete (req.query as any)[key];
      }
      Object.assign(req.query, parsed);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === "ZodError") {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return sendError(res, "Invalid query parameters", 400, formattedErrors);
      }
      return sendError(res, "Invalid query payload", 400, error?.message || error);
    }
  };
};
