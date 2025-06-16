import conflictController from "../controller/conflictController.js";

import Router from "express";

export const conflictRouter = Router();

// Rutas para manejar conflictos
conflictRouter.get("/", conflictController.getConflictsByEvent);
conflictRouter.get("/conflict", conflictController.getConflictById);
conflictRouter.post("/", conflictController.createConflict);
conflictRouter.put("/resolve/", conflictController.resolveConflict);
conflictRouter.put("/ignore/", conflictController.ignoreConflict);
