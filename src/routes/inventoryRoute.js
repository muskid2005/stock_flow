import express from "express";
import { getInventory } from "../controllers/inventory.js";
// import { isAdmin } from "../middlewares/authMiddlewares.js";
import jwtAuth from "../middlewares/jwtAuth.js";
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

router.get("/inventory", jwtAuth, getInventory);
router.post("/inventory/incoming", jwtAuth, recordIncoming);
router.post("/inventory/outgoing", jwtAuth, recordOutgoing);
router.put("/incoming/:id", jwtAuth, updateIncoming);
router.put("/outgoing/:id", jwtAuth, updateOutgoing);
router.get("/incoming", jwtAuth, getAllIncoming);
router.get("/outgoing", jwtAuth, getAllOutgoing);
router.delete("/incoming/:id", jwtAuth, deleteIncoming);
router.delete("/outgoing/:id", jwtAuth, deleteOutgoing);

export default router;
