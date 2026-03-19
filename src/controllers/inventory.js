import Incoming from "../models/Incoming.js";
import sequelize from "../config/database.js";

export const getInventory = async (req, res) => {
  try {
    // 1. Fetch live stock for the main table
    const inventory = await Incoming.findAll({
      order: [["productName", "ASC"]],
    });

    // 2. Calculate Supplier Breakdown (The status bars at the bottom)
    const supplierBreakdown = await Incoming.findAll({
      attributes: [
        "supplier",
        [sequelize.fn("COUNT", sequelize.col("sku")), "skuCount"],
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalUnits"],
      ],
      group: ["supplier"],
      order: [[sequelize.literal('"totalUnits"'), "DESC"]],
    });

    // 3. Process items for the UI
    const items = inventory.map((item) => ({
      sku: item.sku,
      productName: item.productName,
      supplier: item.supplier,
      zone: item.zoneName,
      qtyAvailable: item.quantity,
      status: item.quantity < 100 ? "Low Stock" : "In Stock",
      capacity: Math.round((item.quantity / 5000) * 100), // Mocking % for the bar
    }));

    // 4. Final Response for the UI
    res.status(200).json({
      summary: {
        totalSKUs: inventory.length,
        totalUnits: inventory.reduce((a, b) => a + b.quantity, 0),
        lowStock: items.filter((i) => i.status === "Low Stock").length,
      },
      inventory: items,
      supplierBreakdown: supplierBreakdown.map((s) => ({
        name: s.supplier,
        skus: s.getDataValue("skuCount"),
        totalUnits: s.getDataValue("totalUnits"),
        fillRate: "95%", // Static for UI demo
        status: "Active",
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
