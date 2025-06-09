import express from "express";
import authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/validate-totp", authController.validateTotp);
// Rutas protegidas (requieren autenticación)
router.post("/logout", authenticateToken, authController.logout);
router.get("/verify-token", authenticateToken, authController.verifyToken);
