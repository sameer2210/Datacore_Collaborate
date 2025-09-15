import React, { useRef, useState , useEffect} from "react";
import "./teamTopBar.css";
import bell from "../../assets/bell.svg";
import chat from "../../assets/chats.svg";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import emptyuser from "../../assets/emptyuser.avif";
import logoutImg from "../../assets/logout.svg";
import LogoutDialog from "./LogoutDialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import constant from "../../constant";
import TeamChatTray from "./TeamChatTray";
import { getAllChatMessages } from "../../api/chat";

const TeamTopBar = () => {
  const chatIconRef = useRef(null);
  const { user: userData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [UnreadNotification, setUnreadNotification] = useState([]);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  console.log(userData);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllChatMessages();
        // console.log("response" ,response)
        if (response.success) {
          // console.log("response data", response.data.messages)
          setUnreadNotification(response.data.totalUnReadMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
    fetchMessages(); // Initial fetch
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount

  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isProfileImageValid =
    userData?.profileImage !== "null" &&
    userData?.profileImage !== null &&
    userData?.profileImage !== undefined &&
    userData?.profileImage !== "";

  return (
    <div className="team_topbar">
      <div className="team_topbar-notifications_container">
        <div
          ref={chatIconRef} // Add this ref
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          onClick={() => setIsChatOpen(!isChatOpen)} // Toggle chat tray
        >
          <img
            src={chat}
            alt="logo"
            height={28}
            width={28}
            style={{ cursor: "pointer" }}
          />
          <div className="team_topbar-notification">{UnreadNotification}</div>
        </div>
        {/* This is commented, but let it be there as it will be use in future */}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src={bell}
            alt="logo"
            height={28}
            width={28}
            style={{ cursor: "pointer" }}
          />
          <div className="team_topbar-notification">1</div>
        </div> */}

        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <img
            src={
              isProfileImageValid
                ? `${constant.IMG_URL}/${userData?.profileImage}`
                : emptyuser
            }
            alt="logo"
            height={40}
            width={40}
            style={{ borderRadius: "50%" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer", // Make the box look clickable
            }}
            onClick={handleClick}
          >
            <Typography
              sx={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                color: "black",
                fontWeight: "500",
                fontFamily: "Inter",
                fontSize: "14px",
              }}
            >
              {userData?.name}

              <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
                <g clipPath="url(#clip0_989_10189)">
                  <path
                    d="M16.25 8L10 14.25L3.75 8"
                    stroke="#A8A8A8"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_989_10189">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Typography>
            <Typography
              sx={{
                width: "max-content",
                color: "#B7B7B7",
                fontSize: 12,
                fontFamily: "Inter",
                textTransform: "capitalize",
              }}
            >
              {userData?.role || "viewer"}
            </Typography>
          </Box>
        </Box>
      </div>
      <Menu
        sx={{ borderRadius: "10px" }}
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              p: 0,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            // navigate("/manage-account");
            handleClose();
          }}
          sx={{ padding: "10px 12px" }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={
                isProfileImageValid
                  ? `${constant.IMG_URL}/${userData?.profileImage}`
                  : emptyuser
              }
              alt="logo"
              height={25}
              width={25}
              style={{ borderRadius: "50%" }}
            />
            <Typography variant="subtitle1" sx={{ fontSize: "14px" }}>
              Manage Account
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDialogOpen(); // Open the confirmation dialog
            handleClose();
          }}
          sx={{ padding: "10px 12px" }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img src={logoutImg} alt="logo" height={24} width={24} />
            <Typography
              variant="subtitle1"
              sx={{ color: "#F27878", fontSize: "14px" }}
            >
              Logout
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <LogoutDialog
        open={openDialog}
        onClose={handleDialogClose}
        // onConfirm={handleLogout}
        onConfirm={() => {
          localStorage.clear();
          navigate("/login");
          logout();
        }}
      />
      <TeamChatTray isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default TeamTopBar;
