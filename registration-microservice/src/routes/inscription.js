import { Router } from "express";

import inscriptionController from "../controller/inscriptionController.js";

export const inscriptionRoutes = Router();

//! PENDING ADD MIDDLEWARES FOR AUTHENTICATION AND AUTHORIZATION

// get inscription by id, all inscriptions, active inscriptions, by event, by type, by status
inscriptionRoutes.get("/by-id", inscriptionController.getInscriptionById);
inscriptionRoutes.get("/all", inscriptionController.getAllInscriptions);
inscriptionRoutes.get("/active", inscriptionController.getActiveInscriptions);
inscriptionRoutes.get(
  "/by-event",
  inscriptionController.getInscriptionsByEvent
);
inscriptionRoutes.get("/by-type", inscriptionController.getInscriptionsByType);
inscriptionRoutes.get(
  "/by-status",
  inscriptionController.getInscriptionsByStatus
);
// get inscriptions by event and status
inscriptionRoutes.get(
  "/by-event-and-status",
  inscriptionController.getInscriptionsByEventAndStatus
);

// create new inscription
inscriptionRoutes.post("/", inscriptionController.createInscription);

// update inscription info
inscriptionRoutes.put("/info", inscriptionController.updateInfoInscription);

// update inscription status (canceled, confirmed, pending)
inscriptionRoutes.put(
  "/cancel",
  inscriptionController.updateStatusInscriptionCanceled
);
inscriptionRoutes.put(
  "/paid",
  inscriptionController.updateStatusInscriptionConfirmed
);
inscriptionRoutes.put(
  "/pending",
  inscriptionController.updateStatusInscriptionPending
);

// delete inscription
inscriptionRoutes.delete("/delete", inscriptionController.deleteInscription);

// generate QR code for inscription
// inscriptionRoutes.post("/generate-qr"); //! sin hacer - falta
