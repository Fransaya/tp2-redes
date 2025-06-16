import authService from "../services/authService.js";
import permissionService from "../services/permissionService.js";
import tokensUserService from "../services/tokensUserService.js";

// Middleware para verificar token de acceso
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    const user = await tokensUserService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

// Middleware para verificar permisos específicos
export const requirePermission = (moduloName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      const hasPermission = await permissionService.checkPermission(
        req.user._id,
        moduloName
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para acceder al módulo: ${moduloName}`,
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  };
};

// Middleware para verificar si el usuario está activo
export const requireActiveUser = (req, res, next) => {
  if (!req.user || !req.user.status) {
    return res.status(403).json({
      success: false,
      message: "Usuario inactivo",
    });
  }
  next();
};

// Middleware opcional para autenticación (no falla si no hay token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const user = await tokensUserService.verifyAccessToken(token);
      req.user = user;
    }

    next();
  } catch (error) {
    // Si hay error en el token, simplemente continúa sin usuario
    next();
  }
};
