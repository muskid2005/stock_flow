import pool from "../config/db.js";

export const inventoryGoods = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error --- from controller inventory" });
  }
};

export const inventoryStatus = async (req, res) => {
  try {
    const LOW_STOCK_LIMIT = zone.capacity * 0.2;

    const result = await pool.query("SELECT * FROM items");

    const items = result.rows.map((item) => {
      let status;

      if (item.quantity === 0) status = "Out of Stock";
      else if (item.quantity <= LOW_STOCK_LIMIT) status = "Low Stock";
      else status = "In Stock";

      return { ...item, status };
    });

    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error --- from controller inventory" });
  }
};

export const inventoryZone = async (req, res) => {
  try {
    const { zoneId } = req.params;

    // get zone info
    const zoneResult = await pool.query("SELECT * FROM zones WHERE id = $1", [
      zoneId,
    ]);

    if (zoneResult.rows.length === 0) {
      return res.status(404).json({ error: "Zone not found" });
    }

    const zone = zoneResult.rows[0];

    // get items in that zone
    const itemsResult = await pool.query(
      "SELECT * FROM inventory WHERE zone_id = $1",
      [zoneId],
    );

    const items = itemsResult.rows;

    // calculate occupied space
    const occupied = items.reduce((total, item) => total + item.quantity, 0);

    const available = zone.capacity - occupied;

    const usedPercent = Math.round((occupied / zone.capacity) * 100);

    res.json({
      zone: zone.name,
      capacity: zone.capacity,
      occupied,
      available,
      usedPercent,
      items,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error --- from controller inventory",
    });
  }
};
