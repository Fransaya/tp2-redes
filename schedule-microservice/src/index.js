import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

import { errorHandler } from "./middleware/errorHandler.js";

// indice de rutas
import { indexRouter } from "./routes/indexRouter.js";

const app = express();

// Conectar a MongoDB
connectDB();

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

// Rutas de Horarios
app.use("/schedule", indexRouter);

// Middleware de manejo de errores
app.use(errorHandler);

// Ruta de salud del servicio
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Microservicio de Horarios funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta por defecto
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Horarios",
    version: "1.0.0",
    endpoints: {
      auth: "/schedule",
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

const PORT = process.env.PORT3 || 3004;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
