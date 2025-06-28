import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure correct path
import authRoutes from "./routes/authRoutes.js"; // Ensure correct path
import taskRoutes from "./routes/taskRoutes.js"; // Ensure correct path
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // Ensure correct path
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(
    cors({
      origin: "http://localhost:3001", // Allow frontend origin
      credentials: true, // Allow cookies/auth headers
    })
  );

//Register routes correctly
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/google",userRoutes);
app.use("/api/meta",adminRoutes);


//Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
