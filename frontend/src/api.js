// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});


// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("pf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// simple AI recommendations for a project
export const getProjectRecommendations = (id) =>
  API.get(`/projects/${id}/recommend`);

export default API;
