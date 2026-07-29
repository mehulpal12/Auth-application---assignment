import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { sendError } from "../utils/response";
import { prisma } from "../config/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const verifyJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access token missing or invalid", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded: TokenPayload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return sendError(res, "User no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    return sendError(res, "Unauthorized: Invalid or expired token", 401, error.message);
  }
};

