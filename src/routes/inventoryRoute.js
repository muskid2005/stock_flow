import express from "express";
import { getInventory } from "../controllers/inventory.js";
// import { isAdmin } from "../middlewares/authMiddlewares.js";
// import jwtAuth from "../middlewares/jwtAuth.js";
import {
  recordIncoming,
  recordOutgoing,
  updateIncoming,
  updateOutgoing,
  getAllIncoming,
  getAllOutgoing,
  deleteIncoming,
  deleteOutgoing,
} from "../controllers/transport.js";

const router = express.Router();

router.get("/inventory", getInventory);
router.post("/inventory/incoming", recordIncoming);
router.post("/inventory/outgoing", recordOutgoing);
router.put("/incoming/:id", updateIncoming);
router.put("/outgoing/:id", updateOutgoing);
router.get("/incoming", getAllIncoming);
router.get("/outgoing", getAllOutgoing);
router.delete("/incoming/:id", deleteIncoming);
router.delete("/outgoing/:id", deleteOutgoing);

export default router;
