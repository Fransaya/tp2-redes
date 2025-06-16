// app.js - Archivo principal actualizado
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { setupLoggin } from "./config/setup.morgan.js";
import { setupProxies } from "./config/proxy.config.js";
import { ROUTES } from "./config/routes.config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de logging
setupLoggin(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint para el API Gateway
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
  });
});

// Endpoint de información del gateway
app.get("/gateway/status", (req, res) => {
  const servicesStatus = ROUTES.map((route) => ({
    service: route.service,
    url: route.url,
    instances: route.instances.length,
    auth: route.auth,
  }));

  res.json({
    gateway: "API Gateway with Load Balancer",
    version: "1.0.0",
    services: servicesStatus,
    loadBalancer: "Round Robin",
  });
});

// Configurar proxies con load balancing
setupProxies(app, ROUTES);

// Crear servidor
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Load Balancer: Round Robin algorithm`);
  console.log(`🔧 Services configured: ${ROUTES.length}`);
  console.log(`💡 Health check: GET /health`);
  console.log(`📋 Gateway status: GET /gateway/status`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
