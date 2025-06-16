import roomController from "../controller/roomController.js";

import Router from "express";

export const roomRouter = Router();

// Defino las rutas para el manejo de salas

// Obtengo salas por id evento
roomRouter.get("/events", roomController.getRoomsByEventId);

// Obtengo una sala por su id
roomRouter.get("/by-id", roomController.getRoomById);

// Verifico disponibilidad de una sala en fecha especifica
roomRouter.get("/availability", roomController.isRoomAvailable);

// Creo y registro una nueva sala
roomRouter.post("/", roomController.createRoom);

// Actualizo una sala por su id
roomRouter.put("/", roomController.updateRoom);

// Elimino una sala por su id
roomRouter.delete("/", roomController.deleteRoom);
