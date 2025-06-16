import activityController from "../controller/activityController.js";

import { Router } from "express";

export const activityRouter = Router();

// Obtengo todas las actividades filtradas (scheduleId, roomId, status, date, type)
activityRouter.get("/", activityController.getActivities);
// Obtengo una actividad por su ID
activityRouter.get("/by-id", activityController.getActivityById);

// Creo una nueva actividad
activityRouter.post("/", activityController.createActivity);
// Modifico una actividad existente
activityRouter.put("/", activityController.updateActivity);
// Elimino una actividad existente
activityRouter.delete("/", activityController.deleteActivity);
