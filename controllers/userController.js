// import User from "../models/User.js";


// export const getUserById = async (req, res) => {
//   try {
//     console.log("User ID from request:", req.params.id); // Debug log
//     console.log("User making request:", req.user); // Debug log

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (req.user.role !== "admin" && req.user.id.toString() !== req.params.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error.message);

//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // ✅ Update user profile (Admin can update any user, user can update themselves)
// export const updateUser = async (req, res) => {
//   try {
//     const { name, email, role } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Only allow admin or the user themselves to update
//     if (req.user.role !== "admin" && req.user.id !== req.params.id) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Update allowed fields
//     user.name = name || user.name;
//     user.email = email || user.email;

//     // Only admin can update the role
//     if (req.user.role === "admin" && role) {
//       user.role = role;
//     }

//     await user.save();

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // // @desc    Get user profile
// // // @route   GET /api/users/profile
// // // @access  Private
// // export const getUserProfile = async (req, res) => {
// //   try {
// //       const user = await User.findById(req.user.id).select('-password'); // Exclude password field

// //       if (!user) {
// //           return res.status(404).json({ message: 'User not found' });
// //       }

// //       res.json(user);
// //   } catch (error) {
// //       res.status(500).json({ message: 'Server error' });
// //   }
// // };


// export const getUserProfile = async (req, res) => {
//   console.log("🚀 Hit /api/users/profile");
//   console.log("🔐 User from req.user:", req.user);

//   return res.status(200).json({ message: "Profile route is working", user: req.user });
// };

import User from "../models/User.js";

// ✅ Get profile of the logged-in user
export const getUserProfile = async (req, res) => {
  console.log("🚀 Hit /api/users/profile");
  console.log("🔐 User from req.user:", req.user);

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get user by ID (Admin or same user)
export const getUserById = async (req, res) => {
  try {
    const requestedId = req.params.id;
    console.log("User ID from request:", requestedId);
    console.log("User making request:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin" && req.user.id !== requestedId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(requestedId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user profile (Admin or same user)
export const updateUser = async (req, res) => {
  try {
    const requestedId = req.params.id;
    const { name, email, role } = req.body;

    const user = await User.findById(requestedId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user.id !== requestedId) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (req.user.role === "admin" && role) {
      user.role = role;
    }

    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
