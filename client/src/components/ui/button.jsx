import React from "react";
import "./button.css";

export const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
