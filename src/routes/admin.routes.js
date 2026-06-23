import { Router } from "express";
import AdminController from "../controllers/adminController.js";
import { validateJwt } from "../middlewares/validateJwt.js";

const router = Router();

// ✅ todas las rutas de admin protegidas con JWT
router.get("/stats", validateJwt, AdminController.getStats);
router.get("/accommodations", validateJwt, AdminController.getAccommodations);
router.get("/users", validateJwt, AdminController.getUsers);

export default router;
