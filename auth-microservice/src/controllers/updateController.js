import { UpdateUserService } from "../services/updateUserService.js";

export class UpdateController {
  async updateInfo(req, res) {
    try {
      const { userId, userUpdated } = req.body;

      if (!userId || !userUpdated) {
        return res.status(400).json({
          success: false,
          message: "El ID del usuario y los datos a actualizar son requeridos",
        });
      }

      const updateUserService = new UpdateUserService();
      const result = await updateUserService.updateInfoUser(
        userId,
        userUpdated
      );

      return res.status(200).json({
        success: true,
        message: "Información actualizada exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { userId, newStatus } = req.body;

      console.log("Datos recibidos para actualizar estado:", userId, newStatus);

      if (!userId || newStatus === undefined) {
        return res.status(400).json({
          success: false,
          message: "El id y nuevo estado es requerido",
        });
      }

      const updateUseService = new UpdateUserService();
      const result = await updateUseService.updateStatusUser(userId, newStatus);

      return res.status(200).json({
        success: true,
        message: "Estado actualizado exitosamente",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { userId, newPassword } = req.body;

      if (!userId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "El id y nueva contraseña son requeridos",
        });
      }

      const updateUseService = new UpdateUserService();
      const result = await updateUseService.updatePasswordUser(
        userId,
        newPassword
      );

      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada exitosamente",
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
