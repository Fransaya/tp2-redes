import User from "../models/User.js";

export class UpdateUserService {
  async updateInfoUser(userId, userUpdated) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar los campos necesarios
      user.user = userUpdated.user || user.user;
      user.rol = userUpdated.rol || user.rol;
      user.status = userUpdated.status || user.status;
      user.totpValidation = userUpdated.totpValidation || user.totpValidation;
      user.updatedAt = Date.now();

      await user.save();
      return user;
    } catch (error) {
      throw new Error("Error al actualizar la información del usuario");
    }
  }

  async updateStatusUser(userId, newStatus) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      user.status = newStatus;
      user.updatedAt = Date.now();

      await user.save();
      return user;
    } catch (error) {
      throw new Error("Error al actualizar el estado del usuario");
    }
  }

  async updatePasswordUser(userId, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      user.password = newPassword;
      user.updatedAt = Date.now();

      await user.save();
      return user;
    } catch (error) {
      throw new Error("Error al actualizar la contraseña del usuario");
    }
  }
}
