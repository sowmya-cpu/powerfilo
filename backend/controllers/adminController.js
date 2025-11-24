import User from "../models/User.js";
import Project from "../models/Project.js";

// get all projects for admin
export const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// approve / reject
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = status;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// manage users (basic list)
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// simple analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const approvedProjects = await Project.countDocuments({ status: "approved" });
    const pendingProjects = await Project.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalProjects,
      approvedProjects,
      pendingProjects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

