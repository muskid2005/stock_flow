import Incoming from "../models/Incoming.js";
import Outgoing from "../models/Outgoing.js";
import Zone from "../models/Zone.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

export const recordIncoming = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { productName, quantity, zoneId, supplier, referenceNumber } =
      req.body;

    const zone = await Zone.findByPk(zoneId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const qty = parseInt(quantity);

    if (zone.currentStock + qty > zone.capacity) {
      return res.status(400).json({
        message: `No Space! ${zone.zone} only has ${
          zone.capacity - zone.currentStock
        } left.`,
      });
    }

    const newEntry = await Incoming.create(
      {
        productName,
        quantity: qty,
        supplier,
        zoneName: zone.zone,
        referenceNumber: referenceNumber || "N/A",
        userId: req.user.id,
        sku: `SKU-${Math.floor(Math.random() * 10000)}-${
          zone.zone.split(" ")[1]
        }`,
      },
      { transaction: t },
    );

    await zone.increment("currentStock", { by: qty, transaction: t });

    await zone.reload({ transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Success",
      data: newEntry,
      percentFull: ((zone.currentStock / zone.capacity) * 100).toFixed(0),
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

export const recordOutgoing = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { productName, zoneName, quantity, destination } = req.body;
    const qtyOut = parseInt(quantity);

    const stocks = await Incoming.findAll({
      where: {
        productName,
        zoneName,
        quantity: { [Op.gt]: 0 },
      },
      order: [["createdAt", "ASC"]],
      transaction: t,
    });

    const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0);

    if (totalStock < qtyOut) {
      return res.status(400).json({
        message: `Insufficient stock! Only ${totalStock} units of ${productName} left in ${zoneName}.`,
      });
    }

    const zone = await Zone.findOne({
      where: { zone: zoneName },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const usedIncomingIds = [];
    let remaining = qtyOut;

    for (const stock of stocks) {
      if (remaining <= 0) break;

      const available = stock.quantity;

      usedIncomingIds.push(stock.id);

      if (available >= remaining) {
        await stock.decrement("quantity", {
          by: remaining,
          transaction: t,
        });
        remaining = 0;
      } else {
        await stock.decrement("quantity", {
          by: available,
          transaction: t,
        });
        remaining -= available;
      }
    }

    const exitEntry = await Outgoing.create(
      {
        productName,
        zoneName,
        quantity: qtyOut,
        destination,
        userId: req.user.id,
        incomingId: usedIncomingIds[0],
        incomingIds: usedIncomingIds,
      },
      { transaction: t },
    );

    if (zone) {
      await zone.decrement("currentStock", {
        by: qtyOut,
        transaction: t,
      });
    }
    await zone.reload({ transaction: t });

    const updatedStocks = await Incoming.findAll({
      where: {
        productName,
        zoneName,
        quantity: { [Op.gt]: 0 },
      },
      transaction: t,
    });

    const remainingStock = updatedStocks.reduce(
      (sum, s) => sum + s.quantity,
      0,
    );

    await t.commit();

    return res.status(201).json({
      message: "SHIPMENT SUCCESSFUL",
      data: exitEntry,
      remainingStock,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: error.message });
  }
};
