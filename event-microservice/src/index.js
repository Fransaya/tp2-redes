import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import { eventRoutes } from "./routes/events.js";

// Middleware de errores
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
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
app.use("/event", eventRoutes);

// Middleware de errores
app.use(errorHandler);

// Ruta de salud del servicio
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Microservicio de Eventos funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta por defecto
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API de Eventos",
    version: "1.0.0",
    endpoints: {
      auth: "/api/event",
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
});
