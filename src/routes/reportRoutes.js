import express from "express";
import { getReportData } from "../controllers/reportController.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/", jwtAuth, getReportData);

export default router;
