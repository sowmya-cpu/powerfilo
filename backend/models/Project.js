// backend/models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    tags: [{ type: String }],
    githubUrl: String,
    demoUrl: String,
    imageUrl: String, // for project thumbnail
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
