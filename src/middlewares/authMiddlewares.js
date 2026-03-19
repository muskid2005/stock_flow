// import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // console.log("Decoded role:", req.user.role);
    next(); // User is admin, proceed to the route
  } else {
    res.status(403).json({ message: "FORBIDDEN: Admin access required" });
  }
};
// export const isAdmin = (req, res, next) => {
//   if (req.user.role === "admin") {
//     console.log("Decoded role:", req.user.role);
//     next(); // User is admin, proceed to the route
//   } else {
//     res.status(403).json({
//       message: "FORBIDDEN: Admin access required",
//     });
//   }
// };
