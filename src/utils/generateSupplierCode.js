import Supplier from "../models/Supplier.js";

export const generateSupplierCode = async () => {
  const lastSupplier = await Supplier.findOne({
    order: [["createdAt", "DESC"]],
  });

  if (!lastSupplier) return "SUP-001";

  const lastCode = lastSupplier.supplierCode; // SUP-009
  const number = parseInt(lastCode.split("-")[1]) + 1;

  return `SUP-${String(number).padStart(3, "0")}`;
};
