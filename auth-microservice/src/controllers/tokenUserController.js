import tokensUserService from "../services/tokensUserService.js";

export class TokenUserController {
  async generateAccessToken(req, res) {
    try {
      const { userId, username, rol } = req.body;

      if (!userId || !username || !rol) {
        return res.status(400).json({
          success: false,
        });
      }

      const accessToken = await tokensUserService.generateAccessToken(
        userId,
        username,
        rol
      );

      return res.status(200).json({
        success: true,
        message: "Token de acceso generado exitosamente",
        data: accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Generar token de refresco
  async generateRefreshToken(req, res) {
    try {
      const { userId, username, rol } = req.body;

      if (!userId || !username || !rol) {
        return res.status(400).json({
          success: false,
        });
      }

      const refreshToken = await tokensUserService.generateRefreshToken(
        userId,
        username,
        rol
      );

      return res.status(200).json({
        success: true,
        message: "Token de refresco generado exitosamente",
        data: refreshToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyAccessToken(req, res) {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
        });
      }

      const decoded = await tokensUserService.verifyAccessToken(accessToken);

      return res.status(200).json({
        success: true,
        message: "Token de acceso verificado exitosamente",
        data: decoded,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyRefreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
        });
      }

      const decoded = await tokensUserService.verifyRefreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token de refresco verificado exitosamente",
        data: decoded,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
