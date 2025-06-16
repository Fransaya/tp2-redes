import { axiosUserMicroservice } from "../utils/axiosConfig.js";

export const permissionsMiddleware = (req, res, next) => {
  const user = req.user;
  console.log("user en permissionsMiddleware:", user);
  const moduleName = req.params.moduleName || req.query.moduleName;
  if (!user || !moduleName) {
    return res.status(400).json({
      success: false,
      message: "El usuario y el nombre del modulo son requeridos",
    });
  }

  axiosUserMicroservice
    .get("/check-permission", {
      params: {
        userId: user.id,
        moduleName: moduleName,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para acceder a este modulo",
        });
      }
    })
    .catch((error) => {
      console.error("Error al verificar permisos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
      });
    });
};
