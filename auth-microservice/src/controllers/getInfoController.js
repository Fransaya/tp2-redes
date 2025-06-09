import { GetUserInfoService } from "../services/getUserInfoService.js";

export class GetInfoController {
  async getInfo(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "El ID del usuario es requerido",
        });
      }

      const getInfoService = new GetUserInfoService();
      const result = await getInfoService.getUserInfo(userId);

      return res.status(200).json({
        success: true,
        message: "Información obtenida exitosamente",
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
