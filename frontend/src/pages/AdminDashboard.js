import React, { useEffect, useState } from "react";
import API from "../api";
import StatsCards from "../components/StatsCards";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState("projects");

  const fetchData = async () => {
    try {
      const [projRes, userRes, analyticsRes] = await Promise.all([
        API.get("/admin/projects"),
        API.get("/admin/users"),
        API.get("/admin/analytics")
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/projects/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {analytics && <StatsCards data={analytics} />}

      <div className="tabs">
        <button
          className={tab === "projects" ? "tab active" : "tab"}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>
        <button
          className={tab === "users" ? "tab active" : "tab"}
          onClick={() => setTab("users")}
        >
          Users
        </button>
      </div>

      {tab === "projects" ? (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.owner?.name}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleStatusChange(p._id, "approved")}>Approve</button>
                    <button onClick={() => handleStatusChange(p._id, "rejected")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
