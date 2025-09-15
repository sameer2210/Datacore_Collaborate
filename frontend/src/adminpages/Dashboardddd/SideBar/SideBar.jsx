import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiLock,
  FiFolder,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
} from "react-icons/fi";
import "./SideBar.css";
import logo from "../../../assets/images/logo.png"; // ✅ Make sure path matches your project

function SideBar() {
  const [openTabs, setOpenTabs] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const closeSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Toggle button for mobile */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <FiMenu />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`p-2 sidebar-overlay ${isOpen ? "active" : ""}`}
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`m-2 sidebar ${isOpen || !isMobile ? "open" : "closed"}`}
      >
        {/* Logo + Admin */}
        <div className="d-flex flex-column align-items-center justify-content-center mb-4 px-3 text-center">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid mb-2"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
          />
          <h4 className="fw-bold mb-0">Admin</h4>
        </div>

        {/* Dashboard */}
        <NavLink
          to="monitor"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={closeSidebar}
        >
          <FiHome className="icon" />
          Dashboard
        </NavLink>

        {/* All Users */}
        <NavLink
          to="all-users"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={closeSidebar}
        >
          <FiUsers className="icon" />
          All Users
        </NavLink>

        {/* All Tabs Dropdown */}
        <button
          className="sidebar-dropdown-btn"
          onClick={() => setOpenTabs(!openTabs)}
        >
          <span className="sidebar-dropdown-label">
            <FiFolder className="icon" />
            All Tabs
          </span>
          {openTabs ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {/* Dropdown Content */}
        <div className={`sidebar-dropdown ${openTabs ? "open" : ""}`}>
          <NavLink to="all-tabs/company" className="sidebar-sublink" onClick={closeSidebar}>Company</NavLink>
          <NavLink to="all-tabs/production" className="sidebar-sublink" onClick={closeSidebar}>Production</NavLink>
          <NavLink to="all-tabs/operational" className="sidebar-sublink" onClick={closeSidebar}>Operational</NavLink>
          <NavLink to="all-tabs/electrical" className="sidebar-sublink" onClick={closeSidebar}>Electrical</NavLink>
          <NavLink to="all-tabs/certifications" className="sidebar-sublink" onClick={closeSidebar}>Certifications</NavLink>
          <NavLink to="all-tabs/uploads" className="sidebar-sublink" onClick={closeSidebar}>Uploads</NavLink>
          <NavLink to="all-tabs/hvac" className="sidebar-sublink" onClick={closeSidebar}>HVAC</NavLink>
          <NavLink to="all-tabs/scada" className="sidebar-sublink" onClick={closeSidebar}>SCADA</NavLink>
          <NavLink to="all-tabs/thermal" className="sidebar-sublink" onClick={closeSidebar}>Thermal</NavLink>
          <NavLink to="all-tabs/equipment" className="sidebar-sublink" onClick={closeSidebar}>Equipment</NavLink>
          <NavLink to="all-tabs/pdf" className="sidebar-sublink" onClick={closeSidebar}>PDF</NavLink>
        </div>

        {/* Change Password */}
        <NavLink
          to="change-password-admin"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
          onClick={closeSidebar}
        >
          <FiLock className="icon" />
          Change Password
        </NavLink>
      </div>
    </>
  );
}

export default SideBar;
