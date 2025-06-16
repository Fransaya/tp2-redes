import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import tokensUserService from "./tokensUserService.js";

import speakeasy from "speakeasy";

dotenv.config();

class AuthService {
  // Iniciar sesión
  async login(username, password) {
    // Buscar usuario por nombre de usuario
    const user = await User.findByUsername(username);

    if (!user || !user.status) {
      throw new Error("Credenciales inválidas");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

    // Actualizar último login
    user.lastLogin = Date.now();

    // Limpiar tokens expirados antes de agregar uno nuevo
    await user.cleanExpiredTokens();

    // Generar tokens
    const accessToken = await tokensUserService.generateAccessToken(user._id);
    const refreshToken = await tokensUserService.generateRefreshToken(user._id);

    // Guardar refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
    });
    await user.save();

    return {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    };
  }

  // Cerrar sesión
  async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Remover el refresh token específico
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );
    await user.save();

    return { message: "Sesión cerrada exitosamente" };
  }

  // validar totp
  async validateTotp(userId, totpCode) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const isValid = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: "base32",
        token: totpCode,
      });

      if (!isValid) {
        throw new Error("Código TOTP inválido");
      }

      user.totpValidation = true;
      await user.save();

      return { status: true, message: "TOTP validado exitosamente" };
    } catch (error) {
      throw new Error(error.message || "Error al validar el TOTP");
    }
  }
}

export default new AuthService();
