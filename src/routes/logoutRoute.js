import express from "express";
import { logoutUser } from "../controllers/authenticateUsers.js";
// import jwtAuth from "../middleware/jwtAuth.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/", jwtAuth, logoutUser);

export default router;
