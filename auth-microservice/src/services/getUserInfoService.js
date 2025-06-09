import User from "../models/User.js";

export class GetUserInfoService {
  async getUserInfo(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error("Error al obtener la información del usuario");
    }
  }
}
