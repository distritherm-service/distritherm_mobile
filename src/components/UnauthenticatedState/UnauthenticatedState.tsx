import React from "react";
import UnauthenticatedStatePresenter from "./UnauthenticatedStatePresenter";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface UnauthenticatedStateProps {
  icon: IconDefinition;
  title: string;
  description: string;
  buttonText?: string;
  onNavigateToLogin: () => void;
  iconColor?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

const UnauthenticatedState: React.FC<UnauthenticatedStateProps> = (props) => {
  return <UnauthenticatedStatePresenter {...props} />;
};

export default UnauthenticatedState; 