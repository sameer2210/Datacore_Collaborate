import React from "react";

const GradientButton = (props) => {
  const {
    onClick,
    children,
    width = "auto",
    height = "auto",
    fontSize = "0.875rem",
    type = "button",
    ...other
  } = props;
  return (
    <button
      type={type}
      style={{ width, height, fontSize }}
      onClick={onClick}
      className="gradient-btn"
      {...other}
    >
      {children}
    </button>
  );
};

export default GradientButton;
