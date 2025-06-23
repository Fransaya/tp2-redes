import speakerController from "../controller/speakerController.js";

import Roter from "express";

export const speakerRouter = Roter.Router();

// Rutas para los speakers
speakerRouter.get("/", speakerController.getSpeakersByEvent);
speakerRouter.get("/by-Id", speakerController.getSpeakerById);
speakerRouter.post("/", speakerController.createSpeaker);
speakerRouter.put("/", speakerController.updateSpeaker);
speakerRouter.delete("/", speakerController.deleteSpeaker);
