import mongoose from "mongoose";
import Task from "../models/Task.js";


// Function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createTask = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Validate assignedTo as a valid ObjectId if provided
    if (req.body.assignedTo && !isValidObjectId(req.body.assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo ID" });
    }

    // Create task
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Todo",
      assignedTo: req.body.assignedTo || null,
      createdBy: req.user.id,  // createdBy assigned properly
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: error.message });
  }
};


// export const getTasks = async () => {
//   const token = localStorage.getItem("token"); 
//   console.log("Token in localStorage:", token); // Debugging step

//   if (!token) {
//     console.error("No token found! User might not be logged in.");
//     throw new Error("Unauthorized: No token");
//   }

//   try {
//     const response = await fetch("http://localhost:5000/api/tasks", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       console.error(`API request failed with status ${response.status}:`, await response.text());
//       throw new Error("Failed to fetch tasks");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     throw error;
//   }
// };

export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// export const getTaskById = async (req, res) => {
//     try {
//         const taskId = req.params.id.trim(); // Trim the ID to remove unwanted spaces/newlines
        
//         // Validate if it's a proper ObjectId
//         if (!mongoose.Types.ObjectId.isValid(taskId)) {
//             return res.status(400).json({ message: "Invalid Task ID" });
//         }

//         const task = await Task.findById(taskId);
//         if (!task) {
//             return res.status(404).json({ message: "Task not found" });
//         }

//         res.json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const getTaskById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const taskId = rawId?.trim();

    console.log(" Raw Task ID:", rawId);
    console.log(" Trimmed Task ID:", taskId);

    // Check if ID exists and is a valid ObjectId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      console.warn(" Invalid Task ID:", taskId);
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      console.warn("Task not found with ID:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Task fetched:", task);
    res.status(200).json(task);
  } catch (error) {
    console.error(" Error in getTaskById:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};




export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, assignedTo } = req.body;

    //Validate assignedTo before updating
    if (assignedTo && !isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo ID" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    if (assignedTo) task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
      const taskId = req.params.id.trim(); // Trim spaces & newline characters

      // Validate if it's a proper ObjectId
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
          return res.status(400).json({ message: "Invalid Task ID" });
      }

      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ message: "Task not found" });
      }

      if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
          return res.status(403).json({ message: "Not authorized to delete this task" });
      }

      await task.deleteOne();
      res.json({ message: "Task deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Get tasks assigned to the currently logged-in user
export const getAssignedTasks = async (req, res) => {
  console.log("Fetching tasks for:", req.params.id);
  try {
    let tasks;
    console.log("User ID:", req.user._id);
    if (req.user.role === "admin") {
      // Show tasks created by admin
      tasks = await Task.find({ createdBy: req.user._id });
    } else {
      // Show tasks assigned to the user
      tasks = await Task.find({ assignedTo: req.user._id });
    }
    console.log("Found tasks:", tasks);

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching assigned tasks:", err);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};

