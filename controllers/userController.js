import User from "../models/User.js";

// Get profile of the logged-in user
export const getUserProfile = async (req, res) => {
  console.log("Hit /api/users/profile");
  console.log("User from req.user:", req.user);

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

// Get user by ID (Admin or same user)
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

//Update user profile (Admin or same user)
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
