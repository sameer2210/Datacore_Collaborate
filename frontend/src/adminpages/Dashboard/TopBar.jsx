/* eslint-disable no-unused-vars */
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import emptyuser from "../../assets/emptyuser.avif";
import logoutImg from "../../assets/logout.svg";
import chat from "../../assets/chats.svg";
import bell from "../../assets/bell.svg";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/AuthContext";
import GradientButton from "../common/GradientButton";
import OutlinedButton from "../common/OutlinedButton";
import LogoutDialog from "./LogoutDialog";
import useOrganizationContext from "../../context/OrgContext";
import constant from "../../constant";
import ChatTray from "./ChatTray";
import { getAllChatMessages } from "../../api/chat";

const TopBar = () => {
  const chatIconRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { logout } = useAuthContext();
  const { data: orgData, loading, error, userData } = useOrganizationContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [UnreadNotification, setUnreadNotification] = useState([]);
  const open = Boolean(anchorEl);
  console.log("userData", userData);

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

    fetchMessages(); // Initial fetch
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  console.log("fetching messages", UnreadNotification);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  // Handle the dialog open/close
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    // Perform logout
    logout();
    handleDialogClose();
    navigate("/login");
  };

  const isProfileImageValid =
    userData?.profileImage !== "null" &&
    userData?.profileImage !== null &&
    userData?.profileImage !== undefined &&
    userData?.profileImage !== "";

  return (
    <div
      style={{
        height: "50px",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1.5rem",
        borderBottom: "1px solid #EFEFEF",
        padding: "10px 0",
      }}
    >
      <div
        ref={chatIconRef} // Add this ref
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={chat}
          alt="logo"
          height={28}
          width={28}
          style={{ cursor: "pointer" }}
          onClick={() => setIsChatOpen(!isChatOpen)} // Toggle chat tray
        />
        <div
          style={{
            position: "absolute",
            height: "13px",
            width: "13px",
            backgroundColor: "#FF3A3A",
            borderRadius: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "-5px",
            right: "-2px",
            color: "#fff",
            fontSize: "8px",
          }}
        >
          {UnreadNotification}
        </div>
      </div>

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
        <div
          style={{
            position: "absolute",
            height: "13px",
            width: "13px",
            backgroundColor: "#FF3A3A",
            borderRadius: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "-5px",
            right: "-2px",
            color: "#fff",
            fontSize: "8px",
          }}
        >
          1
        </div>
      </div> */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mr: "1.5rem",
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
            }}
          >
            Admin
          </Typography>
        </Box>
      </Box>
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
            navigate("/manage-account");
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

      {/* Logout Confirmation Dialog */}
      {/* <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        
          <OutlinedButton onClick={handleDialogClose}>Cancel</OutlinedButton>
          <GradientButton onClick={handleLogout}>Yes</GradientButton>
        </DialogActions>
      </Dialog> */}

      <LogoutDialog
        open={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleLogout}
        text='Do you want to logout?'
      />
      <ChatTray
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        anchorRef={chatIconRef}
      />
    </div>
  );
};

export default TopBar;
