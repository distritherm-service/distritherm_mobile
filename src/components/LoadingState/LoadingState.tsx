import React from "react";
import LoadingStatePresenter from "./LoadingStatePresenter";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Chargement...",
  size = "large",
}) => {
  return (
    <LoadingStatePresenter
      message={message}
      size={size}
    />
  );
};

export default LoadingState; 