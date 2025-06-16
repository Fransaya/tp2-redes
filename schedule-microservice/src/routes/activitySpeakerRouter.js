import activitySpeakerController from "../controller/activitySpeakerController.js";

import { Router } from "express";

export const activitySpeakerRouter = Router();

// Asignar expositor a una actividad
activitySpeakerRouter.post(
  "/",
  activitySpeakerController.assignSpeakerToActivity
);
// Eliminar expositor de una actividad
activitySpeakerRouter.delete(
  "/",
  activitySpeakerController.removeSpeakerFromActivity
);
