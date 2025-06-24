import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "src/hooks/useColors";
import { EmptyStateProps } from "./EmptyState";

const EmptyStatePresenter: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  iconColor = 'primary',
  variant = 'default',
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    // Default variant - card-based design
    defaultContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(24),
    },
    defaultCard: {
      backgroundColor: colors.surface,
      borderRadius: ms(20),
      padding: ms(32),
      alignItems: "center",
      maxWidth: ms(300),
      shadowColor: colors.tertiary[300],
      shadowOffset: { width: 0, height: ms(6) },
      shadowOpacity: 0.1,
      shadowRadius: ms(16),
      elevation: 8,
      borderWidth: ms(1),
      borderColor: colors.tertiary[100],
    },
    defaultIconContainer: {
      backgroundColor: colors[iconColor][100],
      width: ms(80),
      height: ms(80),
      borderRadius: ms(40),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ms(20),
      borderWidth: ms(2),
      borderColor: colors[iconColor][200],
    },
    defaultTitle: {
      fontSize: ms(18),
      fontWeight: "800",
      color: colors.tertiary[500],
      textAlign: "center",
      marginBottom: ms(10),
      letterSpacing: ms(0.2),
    },
    defaultDescription: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: ms(20),
    },
    
    // Gradient variant - more prominent with background gradient
    gradientContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(20),
    },
    gradientCard: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: colors[iconColor][300],
      shadowColor: colors[iconColor][500],
      borderRadius: ms(20),
      padding: ms(36),
      alignItems: "center",
      borderWidth: 1.5,
      shadowOffset: { width: 0, height: ms(6) },
      shadowOpacity: 0.2,
      shadowRadius: ms(12),
      elevation: 10,
      maxWidth: ms(340),
    },
    gradientTitle: {
      color: colors[iconColor][600],
      fontSize: ms(18),
      fontWeight: "700",
      textAlign: "center",
      marginBottom: ms(12),
      letterSpacing: ms(0.3),
    },
    gradientDescription: {
      color: colors.textSecondary,
      fontSize: ms(14),
      textAlign: "center",
      lineHeight: ms(20),
      fontWeight: "500",
    },
    
    // Minimal variant - simple centered design
    minimalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(24),
    },
    minimalTitle: {
      fontSize: ms(16),
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: ms(8),
      marginTop: ms(16),
    },
    minimalDescription: {
      fontSize: ms(12),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: ms(18),
      fontWeight: "500",
    },
  });

  const renderIcon = (size: number) => (
    <FontAwesomeIcon 
      icon={icon} 
      size={ms(size)}
      color={colors[iconColor][variant === 'gradient' ? 500 : 400]}
    />
  );

  if (variant === 'gradient') {
    return (
      <View style={dynamicStyles.gradientContainer}>
        <View style={dynamicStyles.gradientCard}>
          {renderIcon(64)}
          <Text style={dynamicStyles.gradientTitle}>{title}</Text>
          <Text style={dynamicStyles.gradientDescription}>{description}</Text>
        </View>
      </View>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={dynamicStyles.minimalContainer}>
        {renderIcon(60)}
        <Text style={dynamicStyles.minimalTitle}>{title}</Text>
        <Text style={dynamicStyles.minimalDescription}>{description}</Text>
      </View>
    );
  }

  // Default variant
  return (
    <View style={dynamicStyles.defaultContainer}>
      <View style={dynamicStyles.defaultCard}>
        <View style={dynamicStyles.defaultIconContainer}>
          {renderIcon(40)}
        </View>
        <Text style={dynamicStyles.defaultTitle}>{title}</Text>
        <Text style={dynamicStyles.defaultDescription}>{description}</Text>
      </View>
    </View>
  );
};

export default EmptyStatePresenter; 