import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de logging básico
app.use((req, res, next) => {
  // Logger de consultas
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Controlador de eventos
app.post("/send", async (req, res, next) => {
  const { email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true,
    tls: {
      // No fallar en certificados inválidos
      rejectUnauthorized: false,
    },
  });

  // Validación básica
  if (!email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos requeridos",
    });
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }

  // Aquí iría la lógica para enviar el correo electrónico
  // Por simplicidad, solo simularemos el envío
  console.log(`Enviando correo a ${email} con asunto "${subject}"`);

  res.json({
    success: true,
    message: "Correo enviado correctamente",
    data: {
      email,
      subject,
      message,
    },
  });
});

// Middleware de errores
app.use(errorHandler);

// Ruta de salud del servicio
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Microservicio de Notificaciones funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta por defecto
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Notificaciones",
    version: "1.0.0",
    endpoints: {
      auth: "/api/notifications",
      health: "/health",
    },
  });
});

// Middleware para rutas no encontradas (debe ir al final)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

// Middleware de manejo de errores (debe ir después del 404)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
