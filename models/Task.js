import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Completed"], // Ensure values match exactly
    default: "Todo",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Allow null for unassigned tasks
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
