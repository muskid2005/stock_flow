import express from "express";
import { filterInventory } from "../controllers/filterController.js";

const router = express.Router();

router.get("/", filterInventory);

export default router;
