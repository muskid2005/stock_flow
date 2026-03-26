import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import { getDashboardSummary } from "../controllers/dashboardSummary.js";

const router = express.Router();

router.get("/summary", jwtAuth, getDashboardSummary);

export default router;
