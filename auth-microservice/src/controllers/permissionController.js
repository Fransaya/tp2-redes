import { PermissionService } from "../services/permissionService.js";

export class PermissionController {
  async getPermissions(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "El ID del usuario es requerido",
        });
      }

      const permissionService = new PermissionService();
      const result = await permissionService.getPermissions(userId);

      return res.status(200).json({
        success: true,
        message: "Permisos obtenidos exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkPermissions(req, res) {
    try {
      const { userId, moduleName } = req.query;

      if (!userId || !moduleName) {
        return res.status(400).json({
          status: false,
          message: "El ID del usuario y el nombre del modulo son requeridos",
        });
      }

      const permissionService = new PermissionService();
      const result = await permissionService.checkPermission(
        userId,
        moduleName
      );

      return res.status(200).json({
        success: true,
        message: "Permiso verificado exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
