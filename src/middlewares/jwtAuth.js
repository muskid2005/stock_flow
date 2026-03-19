// src/middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user info to request
    // console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default jwtAuth;
