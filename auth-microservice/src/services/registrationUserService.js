import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { generateQr } from "../utils/generateQr.js";

dotenv.config();

export class UserRegistrationService {
  // Registrar nuevo usuario
  async register(user) {
    try {
      const existingUser = await User.findOne({
        user: user.user,
        email: user.email,
      });

      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      const hasshedPassword = await bcrypt.hash(user.password, 10);

      const defaultRole = {
        id: "user",
        title: "Usuario",
        permissions: [
          {
            id: "read",
            modulo: "dashboard",
          },
        ],
      };

      // Crear un nuevo usuario
      const newUser = new User({
        user: user.user,
        email: user.email,
        password: hasshedPassword,
        rol: defaultRole,
        totpValidation: false,
        status: true,
      });

      const qr = await generateQr(user.email, "app");

      newUser.totpSecret = qr.secret;

      const userNew = await newUser.save();

      return {
        user: userNew,
        qr,
      };
    } catch (error) {
      throw new Error(error.message || "Error al registrar el usuario");
    }
  }
}
