import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validateRequest(RegisterSchema), AuthController.register);
router.post("/login", validateRequest(LoginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", verifyJWT, AuthController.logout);
router.get("/me", verifyJWT, AuthController.me);

export default router;

