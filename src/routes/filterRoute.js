import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import { filterInventory } from "../controllers/filterController.js";

const router = express.Router();

router.get("/", jwtAuth, filterInventory);

export default router;
