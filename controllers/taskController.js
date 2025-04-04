import mongoose from "mongoose";
import Task from "../models/Task.js";
import { taskValidation } from "../validation/taskValidation.js";


// export const createTask = async (req, res) => {
//     try {
//       console.log("Received request body:", req.body);
  
//       // ✅ Convert `assignedTo` to string if present
//       const requestData = {
//         ...req.body,
//         assignedTo: req.body.assignedTo ? String(req.body.assignedTo) : undefined,
//         status: req.body.status || "Todo", // ✅ Ensure correct status assignment
//       };
  
//       // ✅ Validate using Joi
//       const { error } = taskValidation(requestData);
//       if (error) return res.status(400).json({ message: error.details[0].message });
  
//       // ✅ Create task
//       const task = new Task({
//         title: requestData.title,
//         description: requestData.description,
//         status: requestData.status, // ✅ Ensuring exact enum value
//         assignedTo: requestData.assignedTo || null,
//         createdBy: req.user.id,
//       });
  
//       await task.save();
//       res.status(201).json(task);
//     } catch (error) {
//       console.error("Create task error:", error);
//       res.status(500).json({ message: error.message });
//     }
//   };
  


// Function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createTask = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // ✅ Validate assignedTo as a valid ObjectId if provided
    if (req.body.assignedTo && !isValidObjectId(req.body.assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo ID" });
    }

    // Create task
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Todo",
      assignedTo: req.body.assignedTo || null,
      createdBy: req.user.id,  // ✅ createdBy assigned properly
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: error.message });
  }
};


  
// ✅ Get All Tasks (Pagination & Filters)
// export const getTasks = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, assignedTo } = req.query;
//     const filter = {};
//     if (status) filter.status = status;
//     if (assignedTo) filter.assignedTo = String(assignedTo);

//     const tasks = await Task.find(filter)
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getTasks = async () => {
  const token = localStorage.getItem("token"); 
  console.log("Token in localStorage:", token); // Debugging step

  if (!token) {
    console.error("No token found! User might not be logged in.");
    throw new Error("Unauthorized: No token");
  }

  try {
    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}:`, await response.text());
      throw new Error("Failed to fetch tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};



// ✅ Get Task by ID
// export const getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id).trim();
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id.trim(); // Trim the ID to remove unwanted spaces/newlines
        
        // Validate if it's a proper ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// // ✅ Update Task (Only Creator/Admin)
// export const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     const { title, description, status, assignedTo } = req.body;
//     task.title = title || task.title;
//     task.description = description || task.description;
//     task.status = status || task.status;
//     if (assignedTo) task.assignedTo = String(assignedTo); // Ensure it's a string

//     const updatedTask = await task.save();
//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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

    // ✅ Validate assignedTo before updating
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


// ✅ Delete Task (Only Creator/Admin)
// export const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await task.deleteOne();
//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
