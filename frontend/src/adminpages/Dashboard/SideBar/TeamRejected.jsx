// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { reportEndpoints } from "../../../api/endpoints/report.endpoints";
// import useFetch from "../../../utils/hooks/useFetch";
// import { unitEndpoints } from "../../../api/endpoints/unit.endpoints";
// import { filterRejectedKPIs } from "../../../utils/rejectedReports";
// import RejectedTable from "../../owner/reports/rejected/RejectedTable";
// import PageHeading from "../../common/PageHeading/PageHeading";
// import OutlinedButton from "../../common/OutlinedButton";
// import usePostApi from "../../../utils/hooks/usePost";
// import GradientButton from "../../common/GradientButton";

// const TeamRejected = () => {
//   const params = useParams();

//   // Fetch the report data
//   const {
//     data: report,
//     loading: reportLoading,
//     error: reportError,
//   } = useFetch(reportEndpoints.getReport(params?.id), {
//     actionableInsight: false,
//     last6YearsReports: false,
//   });

//   // Fetch the units data
//   const {
//     data: unitsData,
//     loading: unitsLoading,
//     error: unitsError,
//   } = useFetch(unitEndpoints.getUnits);

//   console.log(report);

//   // Filter the rejected KPIs only when the report is available
//   const rejectedData =
//     !reportLoading && report ? filterRejectedKPIs(report?.report) : null;

//   const navigate = useNavigate();

//   // Loading and error handling logic
//   if (reportLoading || unitsLoading) {
//     return <div>Loading...</div>; // Show a loading state while data is being fetched
//   }

//   if (reportError || unitsError) {
//     return <div>Error loading data. Please try again later.</div>; // Show an error message if data fetching fails
//   }

//   return (
//     <div className="rejected-container">
//       <PageHeading
//         text={"Add essential data points"}
//         onClick={() => navigate(-1)}
//         hideBack
//       />

//       {rejectedData && (
//         <div className="rejected-tables_container">
//           {rejectedData?.basicSectorSpecificKPI && (
//             <RejectedTable
//               title={`Base: Sector Specific KPI`}
//               unitsData={unitsData}
//               reportData={rejectedData?.basicSectorSpecificKPI}
//               kpiName={`basicSectorSpecificKPI`}
//             />
//           )}

//           {rejectedData?.environmentKPI && (
//             <RejectedTable
//               title={`Environmental KPI`}
//               unitsData={unitsData}
//               reportData={rejectedData?.environmentKPI}
//               kpiName={`environmentKPI`}
//             />
//           )}

//           {rejectedData?.socialKPI && (
//             <RejectedTable
//               title={`Social KPI`}
//               unitsData={unitsData}
//               reportData={rejectedData?.socialKPI}
//               kpiName={`socialKPI`}
//             />
//           )}

//           {rejectedData?.governanceKPI && (
//             <RejectedTable
//               title={`Governance & Economics KPI`}
//               unitsData={unitsData}
//               reportData={rejectedData?.governanceKPI}
//               kpiName={`governanceKPI`}
//             />
//           )}
//         </div>
//       )}

//       {/* <div
//         style={{
//           display: "flex",
//           gap: "10px",
//           alignItems: "center",
//           justifyContent: "flex-end",
//         }}
//       >
//         <OutlinedButton fontSize="0.875rem">Cancel</OutlinedButton>

//         <GradientButton fontSize="0.875rem">Submit</GradientButton>
//       </div> */}
//     </div>
//   );
// };

// export default TeamRejected;
