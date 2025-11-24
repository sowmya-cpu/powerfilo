import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectGrid = ({ projects }) => {
  if (!projects?.length) return <p>No projects found.</p>;

  return (
    <div className="project-grid">
      {projects.map((p) => (
        <ProjectCard key={p._id} project={p} />
      ))}
    </div>
  );
};

export default ProjectGrid;
