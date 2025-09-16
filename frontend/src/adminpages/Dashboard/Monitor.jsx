// /* eslint-disable no-unused-vars */
// import { Box, Typography } from '@mui/material';
// import { useEffect, useRef, useState } from 'react';
// import { reportEndpoints } from '../../api/endpoints/report.endpoints';
// import { deleteReport } from '../../api/reportApis.js';
// import EmptyState from '../../components/common/EmptyState';
// import SkeletonCard from '../../components/common/SkeletonCard';
// import useFetch from '../../utils/hooks/useFetch';
// import CreateReport from '../owner/CreateReport';
// import './dashboardStyles.css';
// import DashboardVettingTable from './DashboardVettingTable';
// import ReportCard from './ReportCard';
// import ReportForVerification from './ReportForVerification';

// const Monitor = () => {
//   const dashBoardOption = useRef(null);
//   const [createReport, setCreateReport] = useState(false);
//   const [drafts, setDrafts] = useState([]);
//   const [draftVersion, setDraftVersion] = useState(0);

//   // ✅ Fetch ready reports
//   const {
//     data: readyReports,
//     loading: loadingReadyReports,
//     error: readyReportsErr,
//     refetch: refetchReadyReports,
//   } = useFetch(reportEndpoints.getReports, {
//     status: 'ready',
//   });

//   // ✅ Fetch drafts
//   const {
//     data: draftsData,
//     loading: draftsLoading,
//     error: draftsError,
//     refetch: refetchDrafts,
//   } = useFetch(reportEndpoints.getReports, {
//     status: 'draft',
//     version: draftVersion,
//   });

//   useEffect(() => {
//     localStorage.removeItem('resetEmail');
//     localStorage.removeItem('resetToken');
//   }, []);

//   // ✅ Drafts response handler
//   useEffect(() => {
//     console.log('📌 Drafts API Response:', draftsData);
//     if (draftsData?.reports) {
//       setDrafts(draftsData.reports);
//     }
//   }, [draftsData]);

//   // ✅ Ready reports log
//   useEffect(() => {
//     console.log('📌 Ready Reports API Response:', readyReports);
//   }, [readyReports]);

//   // ✅ Delete Draft
//   const handleDeleteDraft = async id => {
//     try {
//       console.log('🗑️ Deleting Draft with ID:', id);
//       await deleteReport(id);
//       setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== id));
//       setDraftVersion(prev => prev + 1);
//       console.log('✅ Draft Deleted, updated drafts:', drafts);
//     } catch (error) {
//       console.error('❌ Error deleting draft:', error);
//       refetchDrafts();
//     }
//   };

//   // ✅ Delete Ready Report
//   const handleDeleteReadyReport = async id => {
//     try {
//       console.log('🗑️ Deleting Ready Report with ID:', id);
//       await deleteReport(id);
//       refetchReadyReports();
//     } catch (error) {
//       console.error('❌ Error deleting ready report:', error);
//       refetchReadyReports();
//     }
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       {createReport ? (
//         <CreateReport closeView={() => setCreateReport(false)} />
//       ) : (
//         <>
//           <Box
//             sx={{
//               height: '100%',
//               width: '100%',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '2rem',
//               p: 3,
//             }}
//           >
//             {/* ✅ Draft Section */}
//             <Box>
//               <Box sx={{ display: 'flex', gap: 4 }}>
//                 <Box sx={{ width: '200px' }}></Box>
//                 <div style={{ width: '1px' }}></div>
//                 <h2 className="dashboard-report_heading">Drafts</h2>
//               </Box>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   gap: '1.5rem',
//                   alignItems: 'stretch',
//                 }}
//                 ref={dashBoardOption}
//               >
//                 {/* Add New Draft Card */}
//                 <Box
//                   sx={{
//                     borderRadius: '10px',
//                     border: '1px dashed #369D9C',
//                     background: '#FFF',
//                     minWidth: '200px',
//                     height: '150px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     gap: '.5rem',
//                     cursor: 'pointer',
//                     '&:hover': {
//                       backgroundColor: '#F6FFF7',
//                     },
//                   }}
//                   onClick={() => setCreateReport(true)}
//                 >
//                   <svg width={26} height={36} viewBox="0 0 31 40" fill="none">
//                     <path
//                       id="Vector"
//                       d="M9.28571 30.2778H17.5714M9.28571 22.0556H17.5714M9.28571 13.8333H11.3571M17.5714 1.5H7.62857C5.30836 1.5 4.14824 1.5 3.26204 1.94809C2.4825 2.34222 1.84873 2.97114 1.45155 3.74471C1 4.62412 1 5.77535 1 8.07778V31.9222C1 34.2247 1 35.376 1.45155 36.2553C1.84873 37.0288 2.4825 37.6578 3.26204 38.0519C4.14824 38.5 5.30836 38.5 7.62857 38.5H17.5714M17.5714 1.5L30 13.8333M17.5714 1.5V10.5444C17.5714 11.6957 17.5714 12.2713 17.7972 12.711C17.9959 13.0978 18.3126 13.4122 18.7024 13.6093C19.1455 13.8333 19.7255 13.8333 20.8857 13.8333H30M30 13.8333V18.9722"
//                       stroke="url(#paint0_linear_932_9820)"
//                       strokeWidth={2}
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <defs>
//                       <linearGradient
//                         id="paint0_linear_932_9820"
//                         x1={1}
//                         y1="1.5"
//                         x2="35.1201"
//                         y2="7.0558"
//                         gradientUnits="userSpaceOnUse"
//                       >
//                         <stop stopColor="#369D9C" />
//                         <stop offset={1} stopColor="#28814D" />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                   <Typography
//                     sx={{
//                       fontSize: '12px',
//                       fontFamily: 'Inter',
//                       fontWeight: 500,
//                       background: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
//                       backgroundClip: 'text',
//                       '-webkitBackgroundClip': 'text',
//                       '-webkitTextFillColor': 'transparent',
//                     }}
//                   >
//                     Add New User
//                   </Typography>
//                 </Box>

//                 {/* Draft Cards */}
//                 <div
//                   style={{
//                     borderRight: '1px solid #DBDBDB',
//                   }}
//                 ></div>

//                 <div className="drafts-container">
//                   {draftsLoading ? (
//                     Array.from({ length: 3 }).map((_, index) => (
//                       <SkeletonCard key={`draft-skeleton-${index}`} />
//                     ))
//                   ) : draftsError ? (
//                     <EmptyState
//                       title="Error loading drafts"
//                       description="There was a problem loading your draft reports. Please try again."
//                       actionText="Retry"
//                       onAction={refetchDrafts}
//                     />
//                   ) : drafts.length === 0 ? (
//                     <EmptyState
//                       title="No drafts yet"
//                       description="Create your first report to get started."
//                       actionText="Create Report"
//                       onAction={() => setCreateReport(true)}
//                     />
//                   ) : (
//                     drafts.map(item => (
//                       <ReportCard key={`draft-${item.id}`} {...item} onDelete={handleDeleteDraft} />
//                     ))
//                   )}
//                 </div>
//               </Box>
//             </Box>

//             {/* ✅ Ready Reports Section */}
//             <Box>
//               <div className="drafts-container">
//                 {loadingReadyReports ? (
//                   Array.from({ length: 3 }).map((_, index) => (
//                     <SkeletonCard key={`ready-skeleton-${index}`} />
//                   ))
//                 ) : readyReportsErr ? (
//                   <EmptyState
//                     title="Error loading reports"
//                     description="There was a problem loading your ready reports. Please try again."
//                     actionText="Retry"
//                     onAction={refetchReadyReports}
//                   />
//                 ) : !readyReports?.reports || readyReports.reports.length === 0 ? (
//                   <EmptyState
//                     title="No reports ready for vetting"
//                     description="Reports that are ready for vetting will appear here."
//                   />
//                 ) : (
//                   readyReports.reports.map(report => (
//                     <ReportForVerification
//                       key={report?.id}
//                       {...report}
//                       onDelete={handleDeleteReadyReport}
//                     />
//                   ))
//                 )}
//               </div>
//             </Box>

//             {/* ✅ Vetting Table Section */}
//             <Box
//               sx={{
//                 width: '100%',
//                 backgroundColor: '#fff',
//                 border: '1px solid #E4E4E4',
//                 borderRadius: '8px',
//                 padding: '1.3rem 1rem',
//               }}
//             >
//               <h2 className="dashboard-report_heading">Your SI Reports Sent for Vetting</h2>
//               <DashboardVettingTable />
//             </Box>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default Monitor;

//--------------------------------------------------------------------------------------------------------------------------

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import SkeletonCard from '../../components/common/SkeletonCard';
import axios from '../../instant/axios'; 
import DashboardVettingTable from './DashboardVettingTable';
import './dashboardStyles.css';

const Monitor = () => {
  const [data, setData] = useState({
    company: [],
    production: [],
    operational: [],
    electrical: [],
    certifications: [],
    uploads: [],
    hvac: [],
    scada: [],
    thermal: [],
    equipment: [],
    pdf: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const [
          companyRes,
          prodRes,
          opRes,
          elecRes,
          certRes,
          uploadRes,
          hvacRes,
          scadaRes,
          thermalRes,
          equipRes,
          pdfRes,
          userRes,
        ] = await Promise.all([
          axios.get(`/admin/company`, headers),
          axios.get(`/admin/production`, headers),
          axios.get(`/admin/operational-data`, headers),
          axios.get(`/admin/electrical-data`, headers),
          axios.get(`/admin/certifications`, headers),
          axios.get(`/admin/upload-documents`, headers),
          axios.get(`/admin/hvac`, headers),
          axios.get(`/admin/scada`, headers),
          axios.get(`/admin/thermal-efficiency`, headers),
          axios.get(`/admin/equipment`, headers),
          axios.get(`/admin/pdf`, headers),
          axios.get(`/admin/all-user`, headers),
        ]);

        // ✅ Remove admin@gmail.com from users
        const uniqueUsers = Array.from(
          new Map(userRes.data.data.map(u => [u.email, u])).values()
        ).filter(u => u.email !== 'admin@gmail.com');

        setData({
          company: companyRes.data.data,
          production: prodRes.data.data,
          operational: opRes.data.data,
          electrical: elecRes.data.data,
          certifications: certRes.data.data,
          uploads: uploadRes.data.data,
          hvac: hvacRes.data.data,
          scada: scadaRes.data.data,
          thermal: thermalRes.data.data,
          equipment: equipRes.data.data,
          pdf: pdfRes.data.data,
          users: uniqueUsers,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAll();
    }
  }, [token]);

  const filterByUser = arr => {
    if (!selectedUser) return [];
    return arr.filter(item => {
      const uid = item.userId || item.user_id;
      return uid === selectedUser._id;
    });
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.map(renderValue).join(', ');
      return Object.values(value).map(renderValue).join(', ');
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  const handleDeleteUser = async (userId, email) => {
    if (window.confirm(`Are you sure you want to delete ${email} and ALL their data?`)) {
      try {
        await axios.delete(`/admin/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(prev => ({
          ...prev,
          users: prev.users.filter(u => u._id !== userId),
        }));

        alert('User and all related data deleted successfully!');
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete user.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '200px' }}></Box>
          <div style={{ width: '1px' }}></div>
          <h2 className="dashboard-report_heading">Loading...</h2>
        </Box>
        <div className="drafts-container">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          p: 3,
        }}
      >
        {/* Users Section (Adapted from Drafts) */}
        <Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ width: '200px' }}></Box>
            <div style={{ width: '1px' }}></div>
            <h2 className="dashboard-report_heading">All Users</h2>
          </Box>

          <div className="drafts-container">
            {data.users.length === 0 ? (
              <EmptyState title="No users yet" description="No users available." />
            ) : (
              data.users.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  onView={() => setSelectedUser(user)}
                  onDelete={() => handleDeleteUser(user._id, user.email)}
                />
              ))
            )}
          </div>
        </Box>

        {/* Selected User Details Section (Adapted from Ready Reports) */}
        {selectedUser && (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <h2 className="dashboard-report_heading">{selectedUser.email} - Details</h2>
              <button
                className="btn btn-outline-secondary btn-sm" // Assuming Bootstrap btn classes are available; adjust if needed
                onClick={() => setSelectedUser(null)}
                style={{
                  border: '1px solid #ccc',
                  background: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Back to Users
              </button>
            </Box>

            <div className="drafts-container">
              {Object.entries({
                Company: data.company,
                Production: data.production,
                Operational: data.operational,
                Electrical: data.electrical,
                Certifications: data.certifications,
                Uploads: data.uploads,
                HVAC: data.hvac,
                SCADA: data.scada,
                Thermal: data.thermal,
                Equipment: data.equipment,
                PDF: data.pdf,
              }).map(([title, dataset]) => {
                const filteredData = filterByUser(dataset);
                if (filteredData.length === 0) return null;
                return <CategoryCard key={title} title={title} data={filteredData[0]} />;
              })}
            </div>
          </Box>
        )}

        {/* Vetting Table Section (Kept as-is for now) */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#fff',
            border: '1px solid #E4E4E4',
            borderRadius: '8px',
            padding: '1.3rem 1rem',
          }}
        >
          <h2 className="dashboard-report_heading">Your SI Reports Sent for Vetting</h2>
          <DashboardVettingTable />
        </Box>
      </Box>
    </Box>
  );
};

// UserCard Component (Adapted from ReportCard for users)
const UserCard = ({ user, onView, onDelete }) => {
  const registeredAt = new Date(user.createdAt).toLocaleDateString();

  const handleView = e => {
    e.preventDefault();
    e.stopPropagation();
    onView();
  };

  const handleDelete = async e => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <>
      <style>{`
        :root {
          --greenGradient: linear-gradient(101.74deg, #369d9c 0%, #28814d 100%);
        }

        .dashboard-report_heading {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 16px;
          padding: 0;
          color: #1c1c1c;
        }

        .drafts-container {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
          overflow-x: auto;
        }

        .report_card {
          min-width: 17rem;
          padding: 1rem;
          max-height: 9.3rem;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: #fff;
          transition: box-shadow 0.2s ease;
          cursor: pointer;
        }

        .report_card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .report_card-heading_container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .report_card-heading {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }

        .report_card-progress-container {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .progress-bar {
          width: 42px !important;
          height: 42px !important;
          border-radius: 100%;
          background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
            conic-gradient(#369d9c 0%, #28814d 0%, #c8ecfb 0%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 3.94px 3.94px 0px #228d8c54;
        }

        .progress-text {
          font-size: 10px;
          font-weight: 400;
          color: #000;
        }

        .report_card-status {
          color: #464646;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .report_card-edit_container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .edited-status {
          font-size: 11px;
          font-weight: 400;
          color: #699191;
        }
      `}</style>
      <div className="report_card" onClick={handleView}>
        <div className="report_card-heading_container">
          <h3 className="report_card-heading">{user.email}</h3>
          <div>
            <Tooltip
              title={
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  sx={{
                    color: 'red',
                    fontSize: '12px',
                    '&:hover': { backgroundColor: 'transparent' },
                    padding: '4px',
                  }}
                  disableRipple
                >
                  Delete User
                </IconButton>
              }
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    '& .MuiTooltip-arrow': { color: 'red' },
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <IconButton size="small">
                <img
                  style={{ cursor: 'pointer' }}
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMiA4QzEyLjU1MDEgOCAxMyA4LjQ0OTk5IDEzIDlDMTEgOSAxMSA5LjQ0OTk5IDExIDEwSDEzQzEzIDkuNDQ5OTkgMTMuNDUwMSAxMCAxNCAxMEMxNC41NTAxIDEwIDE1IDEwLjQ1MDEgMTUgMTFDMTUgMTEuNTUwMSAxNC41NTAxIDEyIDE0IDEySDEyQzEyIDExLjQ0OTkgMTEuNTUwMSAxMiAxMSAxMkMxMSAxMi41NTAxIDExLjQ0OTkgMTMgMTIgMTNDMTIuNTUwMSAxMyAxMyAxMi41NTAxIDEzIDEySDE1QzE1IDEyLjU1MDEgMTQuNTUwMSAxMyAxNCAxM0gxMUMxMC40NDk5IDEzIDEwIDEyLjU1MDEgMTAgMTJDMTAgMTEuNDQ5OSAxMC40NDk5IDExIDExIDExSDEwQzEwIDExLjU1MDEgOS40NDk5OSAxMiA5IDEyQzkuNDQ5OTkgMTIuNTUwMSAxMCAxMyAxMCAxM0gxMkMxMC40NDk5IDEzIDEwIDEyLjU1MDEgMTAgMTJDMTAgMTEuNDQ5OSAxMC40NDk5IDExIDExIDExSDEzQzEyLjU1MDEgMTEgMTIgMTAuNTUwMSAxMiAxMEgxMUgxMUMxMSAxMC40NDk5IDEwLjU1MDEgMTAgMTAgMTBDOS40NDk5OSAxMCA5IDEwLjQ0OTkgOSA5QzkgNy40NDk5OSAxMC40NDk5IDcgMTIgN1pNMTIgNUgxMkMxMC40NDk5IDUgOS41MDAwMSAyLjUwMDAxIDEwIDMuNUwxMSAyTDEyIDRMMjMgNUwyNCA1LjVMMjQgNlYyMFY1LjVMMjQgNUwyMyA1TDEyIDVDMTIuNSAyLjUwMDAxIDEzLjQ5OTkgNSAxMiA1Wk0xOCAxOEMxOCAxNi40NDk5IDE2LjU1MDEgMTUgMTUgMTVDMTMuNDQ5OSAxNSAxMiAxNS40NDk5IDEyIDE3QzEyIDE4LjU1MDEgMTMuNDQ5OSAxOSA1IDE5WiIgZmlsbD0iI0ZGMzQzQSIvPgo8L2c+Cjwvc3ZnPgo=" // Placeholder for threeDots.svg base64; replace with actual
                  height={20}
                  width={20}
                  alt="Actions"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="report_card-progress-container">
          <div className="progress-bar">
            <div className="progress-text">User</div>
          </div>
          <div className="report_card-status">Registered</div>
        </div>

        <div className="report_card-edit_container">
          <div>
            <span className="edited-status">Registered {registeredAt}</span>
          </div>
        </div>
      </div>
    </>
  );
};

// CategoryCard Component (Adapted for category details)
const CategoryCard = ({ title, data }) => {
  return (
    <>
      <style>{`
        .report_card {
          min-width: 17rem;
          padding: 1rem;
          min-height: 15rem; /* Increased height for details */
          max-height: 20rem;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: #fff;
          transition: box-shadow 0.2s ease;
          cursor: default;
        }

        .report_card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .report_card-heading {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          color: #1c1c1c;
        }

        .report_card-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 12rem;
          overflow-y: auto;
          font-size: 0.8rem;
        }

        .detail-row {
          display: flex;
          border-bottom: 1px solid #eee;
          padding: 0.25rem 0;
        }

        .detail-key {
          font-weight: bold;
          width: 120px;
          color: #666;
          flex-shrink: 0;
        }

        .detail-val {
          flex-grow: 1;
          color: #333;
          word-break: break-word;
        }
      `}</style>
      <div className="report_card">
        <h3 className="report_card-heading">{title}</h3>
        {data ? (
          <div className="report_card-details">
            {Object.entries(data).map(([key, val]) => (
              <div className="detail-row" key={key}>
                <div className="detail-key">{key}</div>
                {/* <div className="detail-val">{renderValue(val)}</div> */}
                {/* <div className="detail-val">renderValue(val)</div> */}
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data available
          </Typography>
        )}
      </div>
    </>
  );
};

export default Monitor;
