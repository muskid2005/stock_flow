import Supplier from "../models/Supplier.js";
import { generateSupplierCode } from "../utils/generateSupplierCode.js";

export const createSupplier = async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      address,
      city,
      region,
      status,
    } = req.body;

    const supplierCode = await generateSupplierCode();

    const supplier = await Supplier.create({
      supplierCode,
      companyName,
      contactName,
      email,
      phone,
      address,
      city,
      region,
      status,
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSuppliers = async (req, res) => {
  try {
    const { count, rows } = await Supplier.findAndCountAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      count,
      suppliers: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.update(req.body);

    res.json({
      status: "success",
      supplier,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.destroy();

    res.json({
      status: "success",
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
