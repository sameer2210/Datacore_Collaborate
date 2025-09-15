import React, { useRef, useState } from "react";
import "./DashBoard.css";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import TopBar from "./TopBar";

function DashBoard() {
  return (
    <div className="ge3s_dashboard_border">
      <SideBar />
      <div className="dashboard_outlet">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}

export default DashBoard;
