import React from "react";

const StatsCards = ({ data }) => {
  const cards = [
    { label: "Total Users", value: data.totalUsers },
    { label: "Total Projects", value: data.totalProjects },
    { label: "Approved", value: data.approvedProjects },
    { label: "Pending", value: data.pendingProjects }
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <h4>{c.label}</h4>
          <p>{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
