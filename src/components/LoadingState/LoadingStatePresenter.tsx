import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { useColors } from "src/hooks/useColors";

interface LoadingStatePresenterProps {
  message: string;
  size: "small" | "large";
}

const LoadingStatePresenter: React.FC<LoadingStatePresenterProps> = ({
  message,
  size,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(24),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      marginTop: ms(16),
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator 
        size={size} 
        color={colors.tertiary[500]} 
      />
      <Text style={dynamicStyles.loadingText}>
        {message}
      </Text>
    </View>
  );
};

export default LoadingStatePresenter; 