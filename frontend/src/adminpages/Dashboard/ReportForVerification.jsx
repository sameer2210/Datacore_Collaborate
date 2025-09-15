import React from "react";
import "./dashboardStyles.css";
import threeDots from "../../assets/threeDots.svg";
import { Link } from "react-router-dom";
import { convertDateToDDMMYYYY } from "../../utils/dateFunctions";
import trash from "../../assets/trash.svg";
import { IconButton, Tooltip } from "@mui/material";
const ReportForVerification = ({ onDelete, ...report }) => {
  // console.log(report);
  const { id, name, year, segment, organizationDetails, grade, score } = report;
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Deleting report with id:", id);
    if (onDelete) {
      onDelete(report.id);
    }
  };
  return (
    <Link
      target="_blank"
      to={`/score-card/${id}`}
      style={{
        textDecoration: "none",
        color: "black",
        display: "inline-block",
      }}
    >
      <div className="verification_card">
        <div className="verification_card-heading_container">
          <div>
            <h3 className="verification_card-heading">
              {/* {organizationDetails?.organization?.name} {segment} {year} */}
              {report?.name}
            </h3>
          </div>
          <div className="verification_card-status_container">
            <div
              className="verification_card-status_div"
              style={{ backgroundColor: "#FFCBC4" }}
            >
              Not Verified
            </div>

            <div>
              <Tooltip
                title={
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    sx={{
                      color: "red",
                      fontSize: "12px",
                      "&:hover": {
                        backgroundColor: "transparent", // Remove hover background
                      },
                      padding: "4px", // Add some padding around text and icon
                      display: "flex",
                      gap: "4px", // Space between icon and text
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
                      bgcolor: "white",
                      "& .MuiTooltip-arrow": {
                        color: "red",
                      },
                      boxShadow: "0px 2px 5px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                <IconButton size="small">
                  <img
                    style={{ cursor: "pointer" }}
                    src={threeDots}
                    height={20}
                    width={20}
                    alt="Actions"
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="verification_card-progress_container">
          <span className="verification_card-percent">
            {/* 65% */}
            {score?.toFixed(2) ?? 65}%
          </span>
          <span className="verification_card-percent-name">
            Sustainability Index Score Card
          </span>
        </div>

        <div className="verification_card-grading_container">
          <span className="verification_card-grade">
            {grade ?? "BC"} Overall Grade
          </span>
          <span className="verification_card-grade_date">
            {convertDateToDDMMYYYY(report?.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ReportForVerification;
