import { Router } from "express";
import eventController from "../controller/eventController.js";

// Rutas de eventos
export const eventRoutes = Router();

// Obtener lista de eventos
eventRoutes.get("/", eventController.getEvents);
eventRoutes.get("/active", eventController.getActiveEvents);
eventRoutes.get("/by-date", eventController.getEventsByDate);

// Crear evento
eventRoutes.post("/", eventController.createEvent);

// Actualizar informacion evento
eventRoutes.put("/:eventId", eventController.updateInfoEvent);

// Actualizar fechas del evento
eventRoutes.patch("/:eventId/dates", eventController.updateEventDates);
// Actualizar ubicación del evento
eventRoutes.patch("/:eventId/location", eventController.updateEventLocation);
// Actualizar capacidad del evento
eventRoutes.patch("/:eventId/capacity", eventController.updateEventCapacity);
// Actualizar estado del evento
eventRoutes.patch("/:eventId/status", eventController.updateEventStatus);
