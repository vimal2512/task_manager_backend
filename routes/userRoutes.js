// import express from "express";
// import { getUserById, updateUser,getUserProfile } from "../controllers/userController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ Admin or user themselves can get their own profile
// router.get("/:id", protect, getUserById);

// // ✅ User can update their profile, Admin can update any user
// router.put("/:id", protect, updateUser);

// router.get('/profile', protect, getUserProfile);

// export default router;

import express from "express";
import {
  getUserById,
  updateUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Route to get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// 🟢 Get user by ID (Admin or same user)
router.get("/:id", protect, getUserById);

// 🟢 Update user by ID (Admin or same user)
router.put("/:id", protect, updateUser);

export default router;

