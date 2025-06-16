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

      const predefinedRoles = [
        {
          id: "admin",
          title: "Administrador",
          permissions: [
            {
              id: "auth",
              modulo: "auth",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              id: "events",
              modulo: "events",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              id: "registration",
              modulo: "registration",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              id: "schedule",
              modulo: "schedule",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
            {
              id: "notifications",
              modulo: "notifications",
              methods: ["GET", "POST", "PUT", "DELETE"],
            },
          ],
        },
        {
          id: "organizer",
          title: "Organizador",
          permissions: [
            { id: "events", modulo: "events", methods: ["GET", "POST", "PUT"] },
            {
              id: "registration",
              modulo: "registration",
              methods: ["GET", "POST", "PUT"],
            },
            {
              id: "schedule",
              modulo: "schedule",
              methods: ["GET", "POST", "PUT"],
            },
            {
              id: "notifications",
              modulo: "notifications",
              methods: ["GET", "POST"],
            },
          ],
        },
        {
          id: "attendee",
          title: "Asistente",
          permissions: [
            { id: "events", modulo: "events", methods: ["GET"] },
            {
              id: "registration",
              modulo: "registration",
              methods: ["GET", "POST"],
            },
            { id: "schedule", modulo: "schedule", methods: ["GET"] },
            { id: "notifications", modulo: "notifications", methods: ["GET"] },
          ],
        },
      ];

      let rolAssgigned;
      if (user.rol) {
        rolAssgigned = predefinedRoles.find((r) => r.id === user.rol.id);
      }
      if (!rolAssgigned) {
        rolAssgigned = predefinedRoles.find((r) => r.id === "attendee");
      }

      // Crear un nuevo usuario
      const newUser = new User({
        user: user.user,
        email: user.email,
        password: user.password,
        rol: rolAssgigned,
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
