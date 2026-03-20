const pool = require("../db/db");


// Inventory report
exports.getInventoryReport = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT id, name, quantity, price, location FROM products"
    );

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Distribution report
exports.getDistributionReport = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        pm.id,
        p.name AS product,
        pm.movement_type,
        pm.quantity,
        pm.from_location,
        pm.to_location,
        pm.created_at
      FROM product_movements pm
      JOIN products p ON pm.product_id = p.id
    `);

    res.json(result.rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};