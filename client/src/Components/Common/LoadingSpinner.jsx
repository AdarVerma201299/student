import React from "react";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  fullPage = false,
  className = "",
}) => {
  // Size classes (Tailwind)
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  // Color classes (Bootstrap + Tailwind)
  const colorClasses = {
    primary: "border-t-primary", // Bootstrap primary color
    secondary: "border-t-secondary", // Bootstrap secondary color
    light: "border-t-light", // Bootstrap light color
    dark: "border-t-dark", // Bootstrap dark color
    success: "border-t-success", // Bootstrap success color
    danger: "border-t-danger", // Bootstrap danger color
  };

  // Full page overlay classes (Bootstrap + Tailwind)
  const fullPageClasses = fullPage
    ? "position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-index-50"
    : "d-inline-block";

  return (
    <div className={`${fullPageClasses} ${className}`}>
      <div
        className={`rounded-circle border-solid border-transparent ${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        style={{ animation: "spin 1s linear infinite" }}
      />
    </div>
  );
};

export default LoadingSpinner;
