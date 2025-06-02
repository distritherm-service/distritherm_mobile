import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import { ms } from "react-native-size-matters";
import colors from "src/utils/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface GoogleSignInPresenterProps {
  isLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
}
const GoogleSignInPresenter = memo<GoogleSignInPresenterProps>(
  ({ isLoading, handleGoogleSignIn }) => {
    return (
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={handleGoogleSignIn}>
          <LinearGradient
            colors={[colors.primary[50], colors.primary[100]]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.content}>
              {isLoading ? (
                <ActivityIndicator size={ms(25)} />
              ) : (
                <>
                  <View style={styles.iconContainer}>
                    <FontAwesome6
                      name="google"
                      size={ms(18)}
                      color={colors.secondary[400]}
                    />
                  </View>
                  <Text style={styles.text}>Continuer avec Google</Text>
                </>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }
);

export default GoogleSignInPresenter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: ms(18),
  },
  button: {
    width: "100%",
    borderRadius: ms(16),
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(4),
    },
    shadowOpacity: 0.15,
    shadowRadius: ms(12),
    elevation: 6,
  },
  gradient: {
    borderRadius: ms(16),
    paddingVertical: ms(10),
    paddingHorizontal: ms(20),
    borderWidth: ms(1.5),
    borderColor: colors.tertiary[200],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ms(12),
  },
  iconContainer: {
    width: ms(32),
    height: ms(25),
    borderRadius: ms(16),
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.tertiary[800],
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 3,
  },
  text: {
    fontSize: ms(14),
    color: colors.secondary[600], // Darker shade for better contrast
    fontWeight: "600",
    letterSpacing: ms(0.3),
  },
});
