import scheduleController from "../controller/scheduleController.js";

import Router from "express";

export const scheduleRouter = Router();

// Obtener todos los programas de un evento
scheduleRouter.get("/", scheduleController.getSchedulesByEventId);
// Obtener un programa por su ID
scheduleRouter.get("/by-id", scheduleController.getScheduleById);
// Crear un nuevo programa
scheduleRouter.post("/", scheduleController.createSchedule);
// Actualizar un programa existente
scheduleRouter.put("/update", scheduleController.updateSchedule);
// Eliminar un programa
scheduleRouter.delete("/delete", scheduleController.deleteSchedule);
// Publica un programa
scheduleRouter.post("/publish", scheduleController.publishSchedule);
