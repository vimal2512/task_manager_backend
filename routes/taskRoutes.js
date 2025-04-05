import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAssignedTasks
} from "../controllers/taskController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//Create Task (Auth Required)
router.post("/", protect, createTask);

// Get All Tasks (With Pagination & Filters)
router.get("/", protect, getTasks);

// Get tasks assigned to the current user
router.get("/user/assigned", protect, getAssignedTasks);


// Get Single Task by ID
router.get("/:id", protect, getTaskById);

// Update Task (Only Creator or Admin)
router.put("/:id", protect,admin, updateTask);

//Delete Task (Only Creator or Admin)
router.delete("/:id", protect,admin, deleteTask);

export default router;
