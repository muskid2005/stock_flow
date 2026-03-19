// import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed to the route
  } else {
    res.status(403).json({ message: "FORBIDDEN: Admin access required" });
  }
};
