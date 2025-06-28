import express from "express";
import { registerUser, loginUser, getMe,refreshAccessToken,logout} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Correct route paths
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/user", userRoute);
console.log("🔁 Refresh route hit at", new Date().toISOString());

router.post("/refresh",refreshAccessToken);
router.post("/logout",logout);

export default router;
