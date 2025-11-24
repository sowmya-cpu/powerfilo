// frontend/src/pages/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API, { getProjectRecommendations } from "../api";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setRecLoading(true);
      const { data } = await getProjectRecommendations(id);
      setRecommended(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchRecommendations();
    // eslint-disable-next-line
  }, [id]);

  if (!project) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="project-details-card">
        {project.imageUrl && (
          <div className="detail-image">
            <img src={project.imageUrl} alt={project.title} />
          </div>
        )}
        <h2>{project.title}</h2>
        <p className="owner">By {project.owner?.name}</p>
        <p className="status-badge">Status: {project.status}</p>
        <p>{project.description}</p>
        <div className="tags">
          {project.techStack?.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {project.tags?.map((t) => (
            <span key={t} className="tag tag-soft">
              #{t}
            </span>
          ))}
        </div>
        <div className="links">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live Demo
            </a>
          )}
        </div>
        <Link to="/" className="btn-outline">
          Back
        </Link>
      </div>

      {/* ====== AI-based Recommended Projects ====== */}
      <div style={{ marginTop: "32px" }}>
        <h3>Recommended Projects for You</h3>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          These are selected using a simple AI similarity score based on tags, tech stack and title.
        </p>

        {recLoading && <p className="center">Finding similar projects...</p>}

        {!recLoading && recommended.length === 0 && (
          <p className="center" style={{ opacity: 0.8 }}>
            No similar projects yet.
          </p>
        )}

        {!recLoading && recommended.length > 0 && (
          <div className="project-grid" style={{ marginTop: "16px" }}>
            {recommended.map((p) => (
              <div
                key={p._id}
                className="project-card"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                {p.imageUrl && (
                  <div className="project-image">
                    <img src={p.imageUrl} alt={p.title} />
                  </div>
                )}
                <h3>{p.title}</h3>
                <p>{p.description?.slice(0, 90)}...</p>
                <div className="tags">
                  {(p.techStack || []).slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="tag tag-soft">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
