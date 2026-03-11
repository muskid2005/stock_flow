import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import authenticationRoute from "./routes/authenticationRoute.js";

dotenv.config();
app.use(cookieparser());
app.use(express.json());

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Stock Flow API!");
});

// app.get("/api/inventory", inventory);

app.use("/auth", authenticationRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
