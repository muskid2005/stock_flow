import Incoming from "../models/Incoming.js";
import Outgoing from "../models/Outgoing.js";
import { Op } from "sequelize";

export const getDashboardSummary = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // RECEIVED THIS MONTH (Incoming)
    const receivedThisMonth = await Incoming.sum("quantity", {
      where: {
        status: "received",
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    //  DELIVERED THIS MONTH (Outgoing)
    const deliveredThisMonth = await Outgoing.sum("quantity", {
      where: {
        status: "delivered",
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    // PENDING (Incoming)
    const pending = await Incoming.count({
      where: {
        status: "pending",
      },
    });

    res.json({
      receivedThisMonth: receivedThisMonth || 0,
      deliveredThisMonth: deliveredThisMonth || 0,
      pending,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
