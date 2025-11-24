import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          PowerFolio+
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/">Explore</Link>
        {user && <Link to="/dashboard">My Dashboard</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <button className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
