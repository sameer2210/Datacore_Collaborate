import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar/SideBar";
import "./DashBoard.css";
import TopBarMinimal from "./SideBar/Topbar";

function DashBoard() {
  return (
    <div className="ge3s_dashboard_border d-flex">
      <SideBar />
      <div className="dashboard_outlet flex-grow-1 p-3">
        <TopBarMinimal/>
        <Outlet />
      </div>
    </div>
  );
}

export default DashBoard;
