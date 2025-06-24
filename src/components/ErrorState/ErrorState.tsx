import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ErrorStatePresenter from "./ErrorStatePresenter";

export interface ErrorStateProps {
  icon?: IconDefinition;
  title?: string;
  description: string;
  buttonText?: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = (props) => {
  return <ErrorStatePresenter {...props} />;
};

export default ErrorState; 