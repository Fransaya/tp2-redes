import Router from "express";

// Controlador de registro de usuario
import { RegistrationController } from "../controllers/registrationController.js";
import { GetInfoController } from "../controllers/getInfoController.js";
import { PermissionController } from "../controllers/permissionController.js";
import { UpdateController } from "../controllers/updateController.js";

// Middleware de autenticacion
import { authenticateToken } from "../middleware/auth.js";

export const router = Router();

// Instanciacion de controladores
const registrationController = new RegistrationController();
const getInfoController = new GetInfoController();
const permissionController = new PermissionController();
const updateController = new UpdateController();

// Registrar nuevo usuario
router.post("/register", registrationController.register);

// Obtengo informacion de usuario
router.get("/info", authenticateToken, getInfoController.getInfo);

// Obtengo permisos de usuario
router.get(
  "/permissions",
  authenticateToken,
  permissionController.getPermissions
);

// Verifico permisos de usuario
router.get(
  "/check-permission",
  authenticateToken,
  permissionController.checkPermissions
);

// Modificar informacion de usuario
router.put("/update-info", authenticateToken, updateController.updateInfo);

// Modificar estado de usuario
router.put("/update-status", authenticateToken, updateController.updateStatus);

// Modificar contraseña de usuario
router.put(
  "/update-password",
  authenticateToken,
  updateController.updatePassword
);
