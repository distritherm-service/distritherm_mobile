import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "src/hooks/useColors";
import { ErrorStateProps } from "./ErrorState";

const ErrorStatePresenter: React.FC<ErrorStateProps> = ({
  icon = faExclamationTriangle,
  title = "Erreur de chargement",
  description,
  buttonText = "Réessayer",
  onRetry,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(24),
    },
    stateCard: {
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
    stateIconContainer: {
      backgroundColor: colors.tertiary[100],
      width: ms(80),
      height: ms(80),
      borderRadius: ms(40),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: ms(20),
    },
    stateTitle: {
      fontSize: ms(18),
      fontWeight: "800",
      color: colors.tertiary[500],
      textAlign: "center",
      marginBottom: ms(10),
      letterSpacing: ms(0.2),
    },
    stateDescription: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: ms(20),
      marginBottom: ms(24),
    },
    actionButton: {
      backgroundColor: colors.tertiary[500],
      paddingHorizontal: ms(24),
      paddingVertical: ms(12),
      borderRadius: ms(14),
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(3) },
      shadowOpacity: 0.25,
      shadowRadius: ms(6),
      elevation: 5,
    },
    actionButtonPressed: {
      backgroundColor: colors.tertiary[600],
      transform: [{ scale: 0.98 }],
    },
    actionButtonText: {
      color: colors.primary[50],
      fontSize: ms(14),
      fontWeight: "700",
    },
  });

  return (
    <View style={dynamicStyles.centeredContainer}>
      <View style={dynamicStyles.stateCard}>
        <View style={dynamicStyles.stateIconContainer}>
          <FontAwesomeIcon 
            icon={icon} 
            size={ms(40)}
            color={colors.danger[500]}
          />
        </View>
        <Text style={dynamicStyles.stateTitle}>{title}</Text>
        <Text style={dynamicStyles.stateDescription}>{description}</Text>
        <Pressable 
          style={({ pressed }) => [
            dynamicStyles.actionButton,
            pressed && dynamicStyles.actionButtonPressed,
          ]}
          onPress={onRetry}
        >
          <Text style={dynamicStyles.actionButtonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ErrorStatePresenter; 