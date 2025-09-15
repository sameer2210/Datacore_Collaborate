import React from "react";

const OutlinedButton = (props) => {
  const {
    onClick,
    children,
    width = "auto",
    height = "auto",
    fontSize = "0.875rem",
    fontWeight = "400",
    type = "button",
    ...other
  } = props;
  return (
    <button
      type={type}
      style={{ width, height, fontSize, fontWeight }}
      className="outlined-gradient-btn"
      onClick={onClick}
      {...other}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
