import express from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getTasksByUserId } from "../controllers/adminController.js";

const router = express.Router();


//Get all users (Admin only)
router.get("/users", protect, admin, getAllUsers);

//Update user role (Admin only)
router.put("/users/:id", protect, admin, updateUserRole);
router.get("/users/:id/tasks", admin, getTasksByUserId);

// Delete user (Admin only)
router.delete("/users/:id", protect, admin, deleteUser);

export default router;
