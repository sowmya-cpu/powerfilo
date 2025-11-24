// backend/controllers/projectController.js
import Project from "../models/Project.js";

// create new project
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, tags, githubUrl, demoUrl, imageUrl } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      tags,
      githubUrl,
      demoUrl,
      imageUrl,
      owner: req.user._id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get projects (public, only approved + optional search/filter)
export const getPublicProjects = async (req, res) => {
  try {
    const { search, tag } = req.query;

    const query = { status: "approved" };

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { techStack: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const projects = await Project.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get logged-in user's projects
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("owner", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // If not approved and not owner/admin, block
    if (
      project.status !== "approved" &&
      project.owner._id.toString() !== req.user?._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view this project" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update project (only owner)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const fields = ["title", "description", "techStack", "tags", "githubUrl", "demoUrl", "imageUrl"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // when user edits, status again pending
    project.status = "pending";

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete project (only owner)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== SIMPLE "AI" RECOMMENDER ========== */

// rule-based similarity (tags + techStack + title words)
const scoreProject = (base, other) => {
  let score = 0;

  // tags overlap
  if (base.tags && other.tags) {
    base.tags.forEach((tag) => {
      if (other.tags.includes(tag)) score += 2;
    });
  }

  // tech stack overlap
  if (base.techStack && other.techStack) {
    base.techStack.forEach((tech) => {
      if (other.techStack.includes(tech)) score += 3;
    });
  }

  // title word overlap
  if (base.title && other.title) {
    const baseWords = base.title.toLowerCase().split(/\s+/);
    const otherTitle = other.title.toLowerCase();
    baseWords.forEach((w) => {
      if (w.length > 3 && otherTitle.includes(w)) {
        score += 1;
      }
    });
  }

  return score;
};

// GET /api/projects/:id/recommend
export const recommendSimple = async (req, res) => {
  try {
    const { id } = req.params;

    const baseProject = await Project.findById(id);
    if (!baseProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // consider only other approved projects
    const others = await Project.find({
      _id: { $ne: id },
      status: "approved"
    });

    const scored = others
      .map((p) => ({
        project: p,
        score: scoreProject(baseProject, p)
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.project);

    res.json(scored);
  } catch (err) {
    console.error("recommendSimple error:", err);
    res.status(500).json({ message: "Failed to generate recommendations" });
  }
};
