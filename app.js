// Modules
import express from "express";
import sequelize from "./src/config/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authenticationRoute.js";
import adminRoutes from "./src/routes/adminroute.js";
import inventoryRoutes from "./src/routes/inventoryRoute.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Setup express and other middleware
const app = express();

// Setup server
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Models
import User from "./src/models/User.js";
import Incoming from "./src/models/Incoming.js";
import Outgoing from "./src/models/Outgoing.js";

// routes
app.get("/", (req, res) => {
  res.json({ status: "ACTIVE", environmenyt: process.env.NODE_ENV });
});
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api", inventoryRoutes);

(async () => {
  try {
    // Test connection
    await sequelize.authenticate();

    // Define relationships
    User.hasMany(Incoming, { foreignKey: "userId" });
    Incoming.belongsTo(User, { foreignKey: "userId" });
    Incoming.hasMany(Outgoing, { foreignKey: "incomingId" });
    Outgoing.belongsTo(Incoming, { foreignKey: "incomingId" });

    // Create tables
    await sequelize.sync({ alter: true });

    // Launch (Local)
    app.listen(PORT, () => {
      console.log(`Listening for requests on http://localhost:3000`);
    });
  } catch (error) {
    // Log errors
    console.error("Unable to start the server:", error);
  }
})();
