import { Router } from "express";
import authRoutes from "./auth.routes";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);

// Protected dummy dashboard API endpoint
router.get("/dashboard", verifyJWT, (req: any, res: any) => {
  res.json({
    success: true,
    message: "Access to protected dashboard data granted.",
    data: {
      status: "Active",
      tokenExpiry: "15 minutes (short-lived Access Token)",
      serverTime: new Date().toISOString(),
      user: req.user,
    }
  });
});

export default router;

