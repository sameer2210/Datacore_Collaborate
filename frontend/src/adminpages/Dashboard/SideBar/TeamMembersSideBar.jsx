// import "./SideBar.css";
// import "./teamMembersSidebar.css";

// import logo from "../../../assets/images/logo.png";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import ReportsSvg from "./ReportsSvg";
// import useFetch from "../../../utils/hooks/useFetch";
// import { reportEndpoints } from "../../../api/endpoints/report.endpoints";
// import { useEffect } from "react";
// import useOrganizationContext from "../../../context/OrgContext";
// import constant from "../../../constant";
// import defaultLogo from "../../../assets/defaultOrg.svg";

// function TeamMembersSideBar() {
//   const { data: orgData } = useOrganizationContext();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     data: reportsData,
//     loading: reportsLoading,
//     error: reportsError,
//   } = useFetch(reportEndpoints.getReports);

//   const filteredReports =
//     reportsData?.reports?.filter(
//       (report) => report.status === "rejected" || report.status === "draft"
//     ) || [];

//   // const links = [
//   //   { id: 0, name: "SI Report 2020", notifications: 0 },
//   //   { id: 1, name: "SI Report 2020 1", notifications: 0 },
//   // ];

//   const links = filteredReports?.map((report) => ({
//     id: report.id,
//     name: report.name,
//     notifications: 0,
//     status: report.status,
//   }));

//   const pathname = location.pathname;

//   useEffect(() => {
//     if (!reportsLoading && links[0]?.status === "rejected")
//       navigate(`/team/rejected/${links[0]?.id}`);
//     else if (!reportsLoading && links[0]?.status === "draft")
//       navigate(`/team/data-points/${links[0]?.id}`);
//     // else navigate(`/team`);
//   }, [reportsData]);

//   return (
//     <div className="sidemenu">
//       <div className="sidemanu_content">
//         <div className="sidemenu_brand">
//           <img
//             src={
//               orgData?.logo
//                 ? `${constant.IMG_URL}/${orgData?.logo}`
//                 : defaultLogo
//             }
//             alt="logo"
//             height={80}
//             width={80}
//           />

//           <div className="subscription_side">
//             <h6>{orgData?.name ?? "Dummy"}</h6>
//           </div>
//         </div>

//         <div className={`team_sidebar-links_container`}>
//           {links?.map((item) => {
//             const isActive = pathname.includes(item?.id);

//             return (
//               <NavLink
//                 to={`/team/${
//                   item?.status === "rejected" ? "rejected" : "data-points"
//                 }/${item?.id}`}
//                 key={item.id}
//                 style={{ textDecoration: "none", color: "black" }}
//               >
//                 <div
//                   className={`team_sidebar-link ${
//                     isActive ? "team_sidebar-link_active" : ""
//                   } `}
//                 >
//                   <ReportsSvg color={isActive ? "#fff" : "#96CDCC"} />
//                   <span className="team_sidebar-link_name">{item.name}</span>
//                   {item.notifications > 0 && (
//                     <div className="team-members_notification_num">
//                       {item.notifications}
//                     </div>
//                   )}
//                 </div>
//               </NavLink>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TeamMembersSideBar;
