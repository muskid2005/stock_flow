import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import authenticationRoute from "./routes/authenticationRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cookieparser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Stock Flow API!");
});

// app.get("/api/inventory", inventory);

app.use("/auth", authenticationRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
