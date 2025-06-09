import User from "../models/User.js";

export class PermissionService {
  async checkPermission(userId, moduleName) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.status) {
        throw new Error("Usuario no encontrado");
      }

      return user.hasPermission(moduleName);
    } catch (error) {
      console.log("Error al verificar permisos", error);
      throw new Error("Error al verificar permisos");
    }
  }

  async getPermissions(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.status) {
        throw new Error("Usuario no encontrado");
      }

      return user.permissions;
    } catch (error) {
      console.log("Error al obtener permisos", error);
      throw new Error("Error al obtener permisos");
    }
  }
}
