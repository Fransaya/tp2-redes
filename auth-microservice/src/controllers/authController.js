import authService from "../services/authService.js";
import { TokenUserService } from "../services/tokensUserService.js";

class AuthController {
  // Iniciar sesión
  async login(req, res) {
    try {
      const { user, password } = req.body;

      if (!user || !password) {
        return res.status(400).json({
          success: false,
          message: "Usuario y contraseña son requeridos",
        });
      }

      const result = await authService.login(user, password);

      // Configurar cookie con refresh token (opcional)
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Validar TOTP
  async validateTotp(req, res) {
    try {
      const { userId, totpCode } = req.body;

      const result = await authService.validateTotp(userId, totpCode);

      if (!userId || !totpCode) {
        return res.status(400).json({
          success: false,
          message: "Usuario y código TOTP son requeridos",
        });
      }

      res.json({
        success: true,
        message: "TOTP validado exitosamente",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Renovar access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body || req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token requerido",
        });
      }

      const decoded = TokenUserService.verifyRefreshToken(refreshToken);

      const result = await TokenUserService.generateRefreshToken(
        decoded.id,
        decoded.username,
        decoded.rol
      );

      res.json({
        success: true,
        message: "Token renovado exitosamente",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cerrar sesión
  async logout(req, res) {
    try {
      const { refreshToken } = req.body || req.cookies;
      const userId = req.user?.id;

      if (!refreshToken || !userId) {
        return res.status(400).json({
          success: false,
          message: "Datos insuficientes para cerrar sesión",
        });
      }

      await authService.logout(userId, refreshToken);

      // Limpiar cookie
      res.clearCookie("refreshToken");

      res.json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        data: {
          user: user.toPublicJSON(),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Verificar token
  async verifyToken(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        message: "Token válido",
        data: {
          user: user.toPublicJSON(),
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
