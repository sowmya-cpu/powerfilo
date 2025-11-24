import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const ProjectForm = ({ editMode }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    tags: "",
    githubUrl: "",
    demoUrl: "",
    imageUrl: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadProject = async () => {
      if (!editMode) return;
      try {
        const { data } = await API.get(`/projects/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          techStack: data.techStack?.join(", "),
          tags: data.tags?.join(", "),
          githubUrl: data.githubUrl || "",
          demoUrl: data.demoUrl || "",
          imageUrl: data.imageUrl || ""
        });
      } catch (err) {
        console.error(err);
      }
    };
    loadProject();
  }, [editMode, id]);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      techStack: form.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };

    try {
      if (editMode) {
        await API.put(`/projects/${id}`, payload);
      } else {
        await API.post("/projects", payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2>{editMode ? "Edit Project" : "Add New Project"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tech Stack (comma separated)
            <input name="techStack" value={form.techStack} onChange={handleChange} />
          </label>
          <label>
            Tags (comma separated)
            <input name="tags" value={form.tags} onChange={handleChange} />
          </label>
          <label>
            GitHub URL
            <input name="githubUrl" value={form.githubUrl} onChange={handleChange} />
          </label>
          <label>
            Demo URL
            <input name="demoUrl" value={form.demoUrl} onChange={handleChange} />
          </label>
          <label>
            Image URL (thumbnail)
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </label>
          <button type="submit" className="btn-primary full">
            {editMode ? "Save Changes" : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
