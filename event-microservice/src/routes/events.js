import { Router } from "express";
import eventController from "../controller/eventController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { permissionsMiddleware } from "../middleware/permissionsMiddleware.js";

// Rutas de eventos
export const eventRoutes = Router();

// Obtener lista de eventos
eventRoutes.get(
  "/",
  authMiddleware,
  permissionsMiddleware,
  eventController.getEvents
);
eventRoutes.get(
  "/active",
  authMiddleware,
  permissionsMiddleware,
  eventController.getActiveEvents
);
eventRoutes.get(
  "/by-date",
  authMiddleware,
  permissionsMiddleware,
  eventController.getEventsByDate
);

// Crear evento
eventRoutes.post(
  "/",
  authMiddleware,
  permissionsMiddleware,
  eventController.createEvent
);

// Actualizar informacion evento
eventRoutes.put(
  "/:eventId",
  authMiddleware,
  permissionsMiddleware,
  eventController.updateInfoEvent
);

// Actualizar fechas del evento
eventRoutes.patch(
  "/:eventId/dates",
  authMiddleware,
  permissionsMiddleware,
  eventController.updateEventDates
);
// Actualizar ubicación del evento
eventRoutes.patch(
  "/:eventId/location",
  authMiddleware,
  permissionsMiddleware,
  eventController.updateEventLocation
);
// Actualizar capacidad del evento
eventRoutes.patch(
  "/:eventId/capacity",
  authMiddleware,
  permissionsMiddleware,
  eventController.updateEventCapacity
);
// Actualizar estado del evento
eventRoutes.patch(
  "/:eventId/status",
  authMiddleware,
  permissionsMiddleware,
  eventController.updateEventStatus
);
