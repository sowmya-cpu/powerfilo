import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import ProjectGrid from "../components/ProjectGrid";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/projects/me");
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchMyProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h2>My Projects</h2>
        <button className="btn-primary" onClick={() => navigate("/projects/new")}>
          + Add Project
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <p>No projects yet. Add your first project!</p>
      ) : (
        <div className="project-grid manage-grid">
          {projects.map((p) => (
            <div key={p._id} className="project-card">
              <h3>{p.title}</h3>
              <p>{p.description.slice(0, 120)}...</p>
              <p>Status: {p.status}</p>
              <div className="actions">
                <Link to={`/projects/${p._id}`} className="btn-link">
                  View
                </Link>
                <Link to={`/projects/${p._id}/edit`} className="btn-outline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p._id)} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
