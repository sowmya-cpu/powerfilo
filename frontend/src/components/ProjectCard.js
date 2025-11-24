import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      {project.imageUrl && (
        <div className="project-image">
          <img src={project.imageUrl} alt={project.title} />
        </div>
      )}
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description.slice(0, 100)}...</p>
        <div className="tags">
          {project.techStack?.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="card-footer">
          <span className={`status status-${project.status}`}>{project.status}</span>
          <Link to={`/projects/${project._id}`} className="btn-link">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
