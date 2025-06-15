import { Router } from "express";

import typeInscriptionController from "../controller/typeInscriptionController.js";

export const typeInscriptionRoutes = Router();

//! PENDING ADD MIDDLEWARES FOR AUTHENTICATION AND AUTHORIZATION
// Get all type inscriptions
typeInscriptionRoutes.get(
  "/all",
  typeInscriptionController.getAllTypeInscriptions
);
// Get active type inscriptions
typeInscriptionRoutes.get(
  "/active",
  typeInscriptionController.getActiveTypeInscriptions
);
// Get type inscription by ID
typeInscriptionRoutes.get(
  "/by-id",
  typeInscriptionController.getTypeInscriptionById
);
// Create a new type inscription
typeInscriptionRoutes.post(
  "/",
  typeInscriptionController.createTypeInscription
);
// Update a type inscription
typeInscriptionRoutes.put(
  "/update",
  typeInscriptionController.updateTypeInscription
);
// Delete a type inscription
typeInscriptionRoutes.delete(
  "/disable",
  typeInscriptionController.deactivateTypeInscription
);
// Activate a type inscription
typeInscriptionRoutes.put(
  "/activate",
  typeInscriptionController.activateTypeInscription
);
