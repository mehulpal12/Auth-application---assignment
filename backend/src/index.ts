import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or reflect the requesting origin
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api", apiRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to MERN Authentication System API",
    documentation: "/api",
  });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 MERN Authentication Server running on port ${PORT}`);
});