import Router from "express";

// Controlador de registro de usuario
import { RegistrationController } from "../controllers/registrationController.js";
import { GetInfoController } from "../controllers/getInfoController.js";
import { PermissionController } from "../controllers/permissionController.js";
import { UpdateController } from "../controllers/updateController.js";
export const router = Router();

// Instanciacion de controladores
const registrationController = new RegistrationController();
const getInfoController = new GetInfoController();
const permissionController = new PermissionController();
const updateController = new UpdateController();

// Registrar nuevo usuario
router.post("/register", registrationController.register);

// Obtengo informacion de usuario
router.get("/info", getInfoController.getInfo);

// Obtengo permisos de usuario
router.get("/permissions", permissionController.getPermissions);

// Verifico permisos de usuario
router.get("/check-permission", permissionController.checkPermissions);

// Modificar informacion de usuario
router.put("/update-info", updateController.updateInfo);

// Modificar estado de usuario
router.put("/update-status", updateController.updateStatus);

// Modificar contraseña de usuario
router.put("/update-password", updateController.updatePassword);
