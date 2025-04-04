import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();


export const protect = async (req, res, next) => {
  console.log("Auth Middleware Running...");

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log token expiration time
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Decoded Token:", decoded);
      console.log("Current Time:", currentTime);
      console.log("Token Expiration Time:", decoded.exp);

      if (decoded.exp < currentTime) {
        return res.status(401).json({ message: "Token has expired. Please log in again." });
      }

      // Fetch user details from DB excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Token invalid." });
      }

      console.log("Authenticated User:", req.user);
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      return res.status(401).json({
        message: error.name === "TokenExpiredError"
          ? "Token expired. Please log in again."
          : "Not authorized. Token verification failed."
      });
    }
  } else {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }
};

// Middleware to restrict access to Admins only
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
};
