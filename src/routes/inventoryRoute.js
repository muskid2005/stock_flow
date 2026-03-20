import express from "express";
import { getInventory } from "../controllers/inventory.js";
// import { isAdmin } from "../middlewares/authMiddlewares.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import { recordIncoming, recordOutgoing } from "../controllers/transport.js";

const router = express.Router();

router.get("/inventory", jwtAuth, getInventory);
router.post("/inventory/incoming", jwtAuth, recordIncoming);
router.post("/inventory/outgoing", jwtAuth, recordOutgoing);

export default router;
