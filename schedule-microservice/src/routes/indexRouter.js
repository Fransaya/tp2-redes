import { Router } from "express";

import { scheduleRouter } from "./scheduleRouter.js";
import { roomRouter } from "./roomRouter.js";
import { activityRouter } from "./activityRouter.js";
import { activitySpeakerRouter } from "./activitySpeakerRouter.js";
import { speakerRouter } from "./speakerRouter.js";
import { conflictRouter } from "./conflictRouter.js";

// Middleware de autenticación y autorización
import { authMiddleware } from "../middleware/authMiddleware.js";
import { permissionsMiddleware } from "../middleware/permissionsMiddleware.js";

export const indexRouter = Router();

// Rutas de base para la programacion
indexRouter.use(
  "/schedules",
  authMiddleware,
  permissionsMiddleware,
  scheduleRouter
);

// Rutas de base para las salas
indexRouter.use("/rooms", authMiddleware, permissionsMiddleware, roomRouter);

// Rutas de base para las actividades
indexRouter.use(
  "/activities",
  authMiddleware,
  permissionsMiddleware,
  activityRouter
);

// Rutas de base para los expositores de actividades
indexRouter.use(
  "/activity-speakers",
  authMiddleware,
  permissionsMiddleware,
  activitySpeakerRouter
);

// Rutas de base para los expositores
indexRouter.use(
  "/speakers",
  authMiddleware,
  permissionsMiddleware,
  speakerRouter
);

// Rutas de base para los conflictos
indexRouter.use(
  "/conflicts",
  authMiddleware,
  permissionsMiddleware,
  conflictRouter
);
