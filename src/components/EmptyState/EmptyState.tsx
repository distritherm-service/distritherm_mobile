import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import EmptyStatePresenter from "./EmptyStatePresenter";

export interface EmptyStateProps {
  icon: IconDefinition;
  title: string;
  description: string;
  iconColor?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  variant?: 'default' | 'gradient' | 'minimal';
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
  return <EmptyStatePresenter {...props} />;
};

export default EmptyState; 