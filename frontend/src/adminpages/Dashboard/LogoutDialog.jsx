import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import OutlinedButton from "../common/OutlinedButton";
import GradientButton from "../common/GradientButton";
import AlertAnimation from "../common/AlertAnimation";

const LogoutDialog = ({ open, onClose, onConfirm, text, subText }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      fullWidth // Ensures the dialog takes full available width up to maxWidth
      maxWidth="sm" // Specifies the maximum width category (600px for 'sm')
      PaperProps={{
        sx: { maxWidth: 500, padding: "32px 16px ", borderRadius: "16px" }, // Explicitly set max width
      }}
    >
      <DialogContent sx={{ p: 0, mb: "1rem" }}>
        <AlertAnimation />
        <DialogContentText
          sx={{
            fontWeight: 500,
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#000",
          }}
          id="logout-dialog-description"
        >
          {text}
          <p style={{ fontSize: "14px", color:"#787878" }}> {subText ? subText : ""}</p>

        </DialogContentText>

      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mx: "3rem",
          gap: "0.7rem",
        }} // Align buttons to the ends
      >
        <OutlinedButton width={"40%"} onClick={onClose}>
          Cancel
        </OutlinedButton>
        <GradientButton width={"40%"} onClick={onConfirm}>
          Yes
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
