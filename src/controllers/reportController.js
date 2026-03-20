import { fn, col, Op } from "sequelize";
import Incoming from "../models/Incoming.js";
import Outgoing from "../models/Outgoing.js";
import Zone from "../models/Zone.js";

export const getReportData = async (req, res) => {
  try {
    const totalSKUs = await Incoming.count({
      distinct: true,
      col: "sku",
    });

    const totalIncoming = (await Incoming.sum("quantity")) || 0;
    const totalOutgoing = (await Outgoing.sum("quantity")) || 0;

    const totalUnits = totalIncoming - totalOutgoing;

    const zones = await Zone.findAll();

    const lowStock = zones.filter(
      (z) => (z.currentStock / z.capacity) * 100 < 30 && z.currentStock > 0,
    ).length;

    const critical = zones.filter((z) => z.currentStock === 0).length;

    const incomingMonthly = await Incoming.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
        [fn("SUM", col("quantity")), "totalIncoming"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
    });

    const outgoingMonthly = await Outgoing.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
        [fn("SUM", col("quantity")), "totalOutgoing"],
      ],
      group: ["month"],
      order: [["month", "ASC"]],
    });

    const inventorySummary = zones.map((zone) => {
      const percentage = zone.capacity
        ? ((zone.currentStock / zone.capacity) * 100).toFixed(0)
        : 0;

      let status = "In Stock";

      if (zone.currentStock === 0) status = "Out of Stock";
      else if (percentage < 30) status = "Low Stock";

      return {
        zone: zone.zone,
        totalStock: zone.currentStock,
        capacity: `${percentage}%`,
        status,
      };
    });

    res.json({
      cards: {
        totalSKUs,
        totalUnits,
        lowStock,
        critical,
      },
      chart: {
        incoming: incomingMonthly,
        outgoing: outgoingMonthly,
      },
      inventorySummary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
