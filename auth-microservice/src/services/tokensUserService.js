import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class TokenUserService {
  // Genero un nuevo token de acceso
  async generateAccessToken(userId, username, rol) {
    try {
      const payloadToken = {
        id: userId,
        username,
        rol,
      };

      const accessToken = jwt.sign(payloadToken, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "15m",
      });

      return accessToken;
    } catch (error) {
      console.log("error al generar token de acceso", error);
      throw new Error("Error al generar token de acceso");
    }
  }

  // Genero un nuevo token de refresco
  async generateRefreshToken(userId, username, rol) {
    try {
      const payloadToken = {
        id: userId,
        username,
        rol,
      };

      const refreshToken = jwt.sign(
        payloadToken,
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
        }
      );

      return refreshToken;
    } catch (error) {
      console.log("error al generar token de refresco", error);
      throw new Error("Error al generar token de refresco");
    }
  }

  // Verifico token normal
  async verifyAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      if (!decoded) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.log("error al verificar el token normal", error);
      throw new Error("Error al verificar el token normal");
    }
  }

  // Verifico token de refreso
  async verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (!decoded) {
        throw new Error("Token de refresco inválido");
      }

      const user = await User.findById(decoded.id);

      // Valido existencia del usuario
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Valido el estado del usuario
      if (!user.status) {
        throw new Error("Usuario inactivo");
      }

      // Valido la validez del token
      const isTokenValid = user.refreshTokens.some(
        (token) => token.token === refreshToken && token.expiresAt > Date.now()
      );

      if (!isTokenValid) {
        throw new Error("Token de refresco inválido");
      }

      return decoded;
    } catch (error) {
      throw new Error("Error al verificar el token de refresco");
    }
  }
}

export default new TokenUserService();
