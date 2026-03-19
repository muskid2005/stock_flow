import express from "express";
import { inventoryStatus, inventoryGoods } from "../controllers/inventory.js";

const router = express.Router();

router.get("/inventory", inventoryGoods);
router.get("/inventory/stats", inventoryStatus);
router.get("/zones/:zoneId/inventory", inventoryZone);

export default router;
