// Modules
import express from "express";
import sequelize from "./src/config/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authenticationRoute.js";
import adminRoutes from "./src/routes/adminroute.js";
import inventoryRoutes from "./src/routes/inventoryRoute.js";
import supplierRoutes from "./src/routes/supplierRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// Setup express and other middleware
const app = express();

// Setup server
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",").map((origin) => origin.trim())
  : [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests like Postman (no origin)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost") || // allow any localhost port
        origin.startsWith("http://127.0.0.1");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  }),
);

// Models
import User from "./src/models/User.js";
import Incoming from "./src/models/Incoming.js";
import Outgoing from "./src/models/Outgoing.js";

// routes
app.get("/", (req, res) => {
  res.json({ status: "ACTIVE", environment: process.env.NODE_ENV });
});
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api", inventoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/reports", reportRoutes);

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
