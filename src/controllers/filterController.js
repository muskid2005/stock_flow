import Incoming from "../models/Incoming.js";
import { Op } from "sequelize";

export const filterInventory = async (req, res) => {
  try {
    const { search, zone, supplier } = req.query;

    const where = {
      quantity: {
        [Op.gt]: 0, // only items still in stock
      },
    };

    // 🔍 Search by product name
    if (search) {
      where.productName = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // 📍 Filter by zone
    if (zone) {
      where.zoneName = zone;
    }

    // 🏢 Filter by supplier
    if (supplier) {
      where.supplier = supplier;
    }

    const inventory = await Incoming.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
