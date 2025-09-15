// UserDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../instant/axios";
import logo from "../assets/images/logo.png"; // logo import

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('/logout', { withCredentials: true });
      localStorage.setItem('token', false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };



  return (
    <div>
      {/* Header */}
      <nav className="navbar navbar-light bg-light shadow-sm px-3 d-flex justify-content-between">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </a>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Header;
