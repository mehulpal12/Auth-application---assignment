import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      return sendSuccess(res, "Login successful", {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: any) {
      return sendError(res, error.message || "Login failed", 401);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register(name, email, password);

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      return sendSuccess(res, "Registration successful", {
        accessToken: result.accessToken,
        user: result.user,
      }, 201);
    } catch (error: any) {
      return sendError(res, error.message || "Registration failed", 400);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401);
      }
      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, "User profile retrieved", user);
    } catch (error: any) {
      return sendError(res, error.message || "Failed to fetch user", 400);
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return sendError(res, "Refresh token missing", 401);
      }

      const result = await AuthService.refresh(refreshToken);
      return sendSuccess(res, "Token refreshed successfully", {
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: any) {
      return sendError(res, "Unauthorized: Invalid or expired refresh token", 401, error.message);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.id);
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
      });

      return sendSuccess(res, "Logout successful", null);
    } catch (error: any) {
      return sendError(res, error.message || "Logout failed", 400);
    }
  }
}

