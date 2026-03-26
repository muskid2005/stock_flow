import express from "express";
import { registerUser, loginUser } from "../controllers/authenticateUsers.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", jwtAuth, loginUser);

export default router;
