import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import SkeletonCard from '../../components/common/SkeletonCard';
import axios from '../../instant/backAxios';
import DashboardVettingTable from './DashboardVettingTable';
import './dashboardStyles.css';

const Monitor = () => {
  const dashBoardOption = useRef(null);
  const [createReport, setCreateReport] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for all backend data
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
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch all data from backend
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
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

        // Remove admin@gmail.com from users and remove duplicates
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
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAll();
    }
  }, [token]);

  // Cleanup localStorage on mount
  useEffect(() => {
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('resetToken');
  }, []);

  // Filter data by selected user
  const filterByUser = arr => {
    if (!selectedUser) return [];
    return arr.filter(item => {
      const uid = item.userId || item.user_id;
      return uid === selectedUser._id;
    });
  };

  // Handle user deletion
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

  // Render utility function
  const renderValue = value => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.map(renderValue).join(', ');
      return Object.values(value).map(renderValue).join(', ');
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {createReport ? (
        <createReport closeView={() => setCreateReport(false)} />
      ) : (
        <>
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
            {/* Drafts Section - Now showing Users */}
            <Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ width: '200px' }}></Box>
                <div style={{ width: '1px' }}></div>
                <h2 className="dashboard-report_heading">Users</h2>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'stretch',
                }}
                ref={dashBoardOption}
              >
                {/* Add New User Card */}
                <Box
                  sx={{
                    borderRadius: '10px',
                    border: '1px dashed #369D9C',
                    background: '#FFF',
                    minWidth: '200px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '.5rem',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F6FFF7',
                    },
                  }}
                  onClick={() => setCreateReport(true)}
                >
                  <svg width={26} height={36} viewBox="0 0 31 40" fill="none">
                    <path
                      id="Vector"
                      d="M9.28571 30.2778H17.5714M9.28571 22.0556H17.5714M9.28571 13.8333H11.3571M17.5714 1.5H7.62857C5.30836 1.5 4.14824 1.5 3.26204 1.94809C2.4825 2.34222 1.84873 2.97114 1.45155 3.74471C1 4.62412 1 5.77535 1 8.07778V31.9222C1 34.2247 1 35.376 1.45155 36.2553C1.84873 37.0288 2.4825 37.6578 3.26204 38.0519C4.14824 38.5 5.30836 38.5 7.62857 38.5H17.5714M17.5714 1.5L30 13.8333M17.5714 1.5V10.5444C17.5714 11.6957 17.5714 12.2713 17.7972 12.711C17.9959 13.0978 18.3126 13.4122 18.7024 13.6093C19.1455 13.8333 19.7255 13.8333 20.8857 13.8333H30M30 13.8333V18.9722"
                      stroke="url(#paint0_linear_932_9820)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_932_9820"
                        x1={1}
                        y1="1.5"
                        x2="35.1201"
                        y2="7.0558"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#369D9C" />
                        <stop offset={1} stopColor="#28814D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      background: 'linear-gradient(102deg, #369D9C 0%, #28814D 100%)',
                      backgroundClip: 'text',
                      '-webkitBackgroundClip': 'text',
                      '-webkitTextFillColor': 'transparent',
                    }}
                  >
                    Add New User
                  </Typography>
                </Box>

                {/* Separator */}
                <div
                  style={{
                    borderRight: '1px solid #DBDBDB',
                  }}
                ></div>

                {/* Users Container */}
                <div className="drafts-container">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonCard key={`user-skeleton-${index}`} />
                    ))
                  ) : error ? (
                    <EmptyState
                      title="Error loading users"
                      description="There was a problem loading users. Please try again."
                      actionText="Retry"
                      onAction={() => window.location.reload()}
                    />
                  ) : data.users.length === 0 ? (
                    <EmptyState
                      title="No users yet"
                      description="No registered users found."
                      actionText="Add User"
                      onAction={() => setCreateReport(true)}
                    />
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
            </Box>

            {/* Ready Reports Section - Now showing Selected User Details */}
            {selectedUser && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <h2 className="dashboard-report_heading">{selectedUser.email} - Data Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    style={{
                      border: '1px solid #369D9C',
                      background: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#369D9C',
                      fontSize: '14px',
                      fontWeight: 500,
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
                    return (
                      <CategoryCard
                        key={title}
                        title={title}
                        data={filteredData[0]}
                        renderValue={renderValue}
                      />
                    );
                  })}
                </div>
              </Box>
            )}

            {/* Vetting Table Section */}
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
        </>
      )}
    </Box>
  );
};

// UserCard Component (styled like ReportCard)
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
    <div className="report_card" onClick={handleView}>
      <div className="report_card-heading_container">
        <div className="report_card-heading-notifications">
          <h3 className="report_card-heading">{user.email}</h3>
        </div>

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
                  display: 'flex',
                  gap: '4px',
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
              <Typography sx={{ fontSize: '18px', color: '#666' }}>⋮</Typography>
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="report_card-progress-container">
        <div
          className="progress-bar"
          style={{
            background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#369d9c 0%, #28814d 100%, #c8ecfb 100%)`,
          }}
        >
          <div className="progress-text">User</div>
        </div>
        <div className="report_card-status">Registered</div>
      </div>

      <div className="report_card-edit_container">
        <div>
          <span className="edited-status">Registered {registeredAt}</span>
        </div>
        <div className="report_card-profile_images">
          <div className="profile-images-container">
            <Typography sx={{ fontSize: '12px', color: '#699191' }}>Click to view data</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

// CategoryCard Component for user data details
const CategoryCard = ({ title, data, renderValue }) => {
  return (
    <div className="verification_card">
      <div className="verification_card-heading_container">
        <h3 className="verification_card-heading">{title}</h3>
      </div>

      {data ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '12rem',
            overflowY: 'auto',
            fontSize: '0.8rem',
          }}
        >
          {Object.entries(data)
            .slice(0, 8)
            .map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #eee',
                  padding: '0.25rem 0',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    width: '120px',
                    color: '#666',
                    flexShrink: 0,
                  }}
                >
                  {key}:
                </div>
                <div
                  style={{
                    flexGrow: 1,
                    color: '#333',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderValue(val)}
                </div>
              </div>
            ))}
          {Object.entries(data).length > 8 && (
            <Typography variant="caption" color="textSecondary">
              ... and {Object.entries(data).length - 8} more fields
            </Typography>
          )}
        </div>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Monitor;
