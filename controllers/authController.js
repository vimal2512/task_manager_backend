import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { registerValidation, loginValidation } from "../validation/authValidation.js";

dotenv.config();

// Generate Access & Refresh Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await newUser.save();

    const { accessToken, refreshToken } = generateTokens(savedUser._id);

    res.status(201).json({
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "admin"
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/authController.js
let isRefreshing = false; // Global variable to prevent multiple refresh calls

export const refreshAccessToken = async (req, res) => {
  if (isRefreshing) {
    return res.status(429).json({ message: "Refresh already in progress" });
  }

  isRefreshing = true;

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      isRefreshing = false;
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify Refresh Token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        isRefreshing = false;
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        isRefreshing = false;
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a new Access Token
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      isRefreshing = false;
      return res.status(200).json({ accessToken });
    });

  } catch (error) {
    isRefreshing = false;
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get Logged-in User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
