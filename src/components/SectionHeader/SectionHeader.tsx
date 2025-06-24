import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import SectionHeaderPresenter from "./SectionHeaderPresenter";

export interface SectionHeaderProps {
  icon: IconDefinition;
  title: string;
  subtitle?: string;
  badgeCount?: number;
  badgeColor?: 'primary' | 'secondary' | 'danger';
  showBadge?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  return <SectionHeaderPresenter {...props} />;
};

export default SectionHeader; 