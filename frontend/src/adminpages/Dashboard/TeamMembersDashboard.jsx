import React from "react";
import "./DashBoard.css";
import { Outlet } from "react-router-dom";
import TeamMembersSideBar from "./SideBar/TeamMembersSideBar";
import TopBar from "./TopBar";
import TeamTopBar from "./TeamTopBar";

function TeamMembersDashboard() {
  return (
    <div className="ge3s_dashboard_border">
      <TeamMembersSideBar />
      <div className="dashboard_outlet">
        {/* <TopBar /> */}
        <TeamTopBar />
        <Outlet />
      </div>
    </div>
  );
}

export default TeamMembersDashboard;
