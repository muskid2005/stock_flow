import express from "express";
import { getAdminDashboard } from "../controllers/adminControllers.js";
import { isAdmin } from "../middlewares/authMiddlewares.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/dashboard", jwtAuth, isAdmin, getAdminDashboard);

export default router;
