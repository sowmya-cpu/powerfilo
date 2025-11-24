import React, { useEffect, useState } from "react";
import API from "../api";
import ProjectGrid from "../components/ProjectGrid";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (tag) params.tag = tag;
      const { data } = await API.get("/projects", { params });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="page home-page">
      <header className="hero">
        <h1>Discover Student Projects</h1>
        <p>Explore, showcase, and manage your academic & personal projects in one place.</p>
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by title, tech, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by tag (e.g. Web, AI)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </header>

      {loading ? <div>Loading...</div> : <ProjectGrid projects={projects} />}
    </div>
  );
};

export default Home;
