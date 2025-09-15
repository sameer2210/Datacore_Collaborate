import React, { useState } from "react";
import { Box, Typography, Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "../../../instant/axios";
 // logo import

const TopBarMinimal = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await axios.get("/logout", { withCredentials: true });
      localStorage.setItem("token", false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 3,
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* ✅ Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
       
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Box>

      {/* ✅ User Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          onClick={handleClick}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        >
          <Avatar src={user?.image || ""} />
          <Typography>{user?.name || "Admin"}</Typography>
          <ArrowDropDownIcon />
        </Box>

       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  <MenuItem
    onClick={handleLogout}
    sx={{
      color: "red",
      fontWeight: "bold",
      px: 3,
      py: 1,
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
      },
    }}
  >
    Logout
  </MenuItem>
</Menu>

      </Box>
    </Box>
  );
};

export default TopBarMinimal;
