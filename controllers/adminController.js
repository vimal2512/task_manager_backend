import User from "../models/User.js";
import Task from "../models/Task.js"; 

//Get all users (Admin only)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Exclude passwords
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).lean(); // `lean()` makes response lightweight

//     // Fetch one task per user (optional: prioritize by latest)
//     const usersWithTaskIds = await Promise.all(
//       users.map(async (user) => {
//         const task = await Task.findOne({ createdBy: user._id }).select("_id");
//         return {
//           ...user,
//           taskId: task?._id?.toString() || null,
//         };
//       })
//     );

//     res.status(200).json(usersWithTaskIds);
//   } catch (error) {
//     console.error("Error in getAllUsers:", error);
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// };



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean(); // Fetch all users

    const usersWithTaskIds = await Promise.all(
      users.map(async (user) => {
        const task = await Task.findOne({ createdBy: user._id })
          .sort({ createdAt: -1 }) // Optional: get latest task
          .select("_id")
          .lean();

        return {
          ...user,
          taskId: task?._id?.toString() || null,
        };
      })
    );

    res.status(200).json(usersWithTaskIds);
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


//Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET /admin/users/:id/tasks
export const getTasksByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    // Optionally: check if user exists before fetching tasks

    const tasks = await Task.find({ assignedTo: userId }); // or `user: userId` based on your schema
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks by user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


