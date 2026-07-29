import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  error?: any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: any
) => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: any
) => {
  const responsePayload: ApiResponse = {
    success: false,
    message,
    ...(error !== undefined && { error }),
  };
  return res.status(statusCode).json(responsePayload);
};
