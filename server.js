require("dotenv").config();

const express = require("express");
const app = express();

const reportRoutes = require("./routes/reportRoutes");

app.use(express.json());

app.use("/reports", reportRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});