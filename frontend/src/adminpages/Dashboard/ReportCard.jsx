import { IconButton, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import emptyuser from '../../assets/emptyuser.avif';
import threeDots from '../../assets/threeDots.svg';
import trash from '../../assets/trash.svg';
import constant from '../../constant';
import { convertDateToDaysAgo } from '../../utils/dateFunctions';
import { useTaggingStore } from '../owner/dataPoints/assignments/chatStore';
import './dashboardStyles.css';

const ReportCard = ({ onDelete, ...report }) => {
  const { allUsers, fetchUsers } = useTaggingStore();

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, allUsers]);

  let percentage =
    ((report?.completedStatus?.done / report?.completedStatus?.total) * 100)?.toFixed(0) || 0;
  percentage = isNaN(percentage) ? 0 : percentage;
  const conicEnd = `${percentage}%`;
  const conicGradient = `conic-gradient(#369d9c 0%, #28814d ${conicEnd}, #c8ecfb ${conicEnd})`;
  const maxVisible = 3;

  const editedAt = convertDateToDaysAgo(report?.updatedAt);

  const assignedUsers = report?.assignUsers || [];
  const matchedUsers = assignedUsers
    .map(userId => allUsers.find(user => user.id === userId))
    .filter(Boolean);

  const handleDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(report.id);
    }
  };

  return (
    <Link
      to={`/add-data-points/${report?.id}`}
      // target="_blank"
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <div className="report_card">
        <div className="report_card-heading_container">
          <div className="report_card-heading-notifications">
            <h3 className="report_card-heading">{report?.name}</h3>
            {report?.unReadMessage > 0 && (
              <div className="report_card-notification">{report.unReadMessage}</div>
            )}
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
                    '&:hover': {
                      backgroundColor: 'transparent', // Remove hover background
                    },
                    padding: '4px', // Add some padding around text and icon
                    display: 'flex',
                    gap: '4px', // Space between icon and text
                  }}
                  disableRipple // Remove ripple effect
                >
                  <img src={trash} alt="trash" />
                  Delete
                </IconButton>
              }
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'white',
                    '& .MuiTooltip-arrow': {
                      color: 'red',
                    },
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <IconButton size="small">
                <img
                  style={{ cursor: 'pointer' }}
                  src={threeDots}
                  height={20}
                  width={20}
                  alt="Actions"
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div className="report_card-progress-container">
          <div
            className="progress-bar"
            style={{
              width: `42px`,
              height: `42px`,
              background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), ${conicGradient}`,
              boxShadow: '0px 3.94px 3.94px 0px #228d8c54',
            }}
          >
            <div className="progress-text">{isNaN(percentage) ? 0 : percentage}%</div>
          </div>
          <div className="report_card-status">Completed</div>
        </div>

        <div className="report_card-edit_container">
          <div>
            <span className="edited-status">
              {editedAt?.includes(':') ? `Edited at ${editedAt}` : `Edited ${editedAt}`}
            </span>
          </div>
          <div className="report_card-profile_images">
            <div className="profile-images-container">
              {/* {users.slice(0, maxVisible).map((item, index) => (
                <img
                  key={index}
                  src={topUser}
                  alt="user"
                  className="profile-image"
                  height={24}
                  width={24}
                />
              ))}
              {users.length > maxVisible && (
                <div className="extra-count">+{users.length - maxVisible}</div>
              )} */}
              {matchedUsers.slice(0, maxVisible).map((user, index) => (
                <img
                  key={index}
                  src={
                    user.profileImage === 'null'
                      ? emptyuser
                      : `${constant.IMG_URL}/${user.profileImage}`
                  }
                  alt={user.name}
                  className="profile-image"
                  height={24}
                  width={24}
                />
              ))}
              {matchedUsers.length > maxVisible && (
                <div className="extra-count">+{matchedUsers.length - maxVisible}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
