import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.post("/", jwtAuth, createSupplier);
router.get("/", jwtAuth, getAllSuppliers);
router.get("/:id", jwtAuth, getSupplier);
router.put("/:id", jwtAuth, updateSupplier);
router.delete("/:id", jwtAuth, deleteSupplier);

export default router;
