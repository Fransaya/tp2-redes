import { UserRegistrationService } from "../services/registrationUserService.js";

export class RegistrationController {
  async register(req, res) {
    try {
      const { user, email, password, rol } = req.body;

      // Validacion de datos recibido
      if (!user || !password) {
        return res.status(400).json({
          success: false,
          message: "Usuario y contraseña son requeridos",
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email es requerido",
        });
      }

      const registrationService = new UserRegistrationService();
      const result = await registrationService.register({
        user,
        email,
        password,
        rol,
      });

      return res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
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
