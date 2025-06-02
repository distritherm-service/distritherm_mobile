import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React from "react";
import colors from "src/utils/colors";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";

interface AuthFormPresenterProps {
  error?: string;
  children: React.ReactNode;
  type: "login" | "register";
  onPressLoginRedirection: () => void;
  onGoBack: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isScrollable: boolean;
  onContentSizeChange: (width: number, height: number) => void;
  onScrollContainerLayout: (event: any) => void;
}

const AuthFormPresenter: React.FC<AuthFormPresenterProps> = ({
  error,
  children,
  type,
  onPressLoginRedirection,
  onGoBack,
  onSubmit,
  isLoading = false,
  isScrollable,
  onContentSizeChange,
  onScrollContainerLayout,
}) => {
  // Footer component to avoid duplication
  const FooterButton = () => (
    <View style={isScrollable ? styles.footerInline : styles.footer}>
      <Pressable style={styles.homeButton} onPress={onGoBack}>
        <LinearGradient
          colors={[colors.secondary[400], colors.secondary[600]]}
          style={styles.homeButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.homeButtonContent}>
            <View style={styles.homeButtonIconContainer}>
              <FontAwesome6
                name="arrow-left"
                size={ms(16)}
                color={colors.primary[50]}
              />
            </View>
            <Text style={styles.homeButtonText}>Revenir en arrière</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100], colors.primary[200]]}
        style={styles.container}
      >
        {/* Header avec bouton de redirection */}
        <View
          style={[
            styles.header,
            type === "login"
              ? { alignItems: "flex-end" }
              : { alignItems: "flex-start" },
          ]}
        >
          <Pressable
            style={styles.redirectionButton}
            onPress={onPressLoginRedirection}
          >
            {type === "login" ? (
              <>
                <Text style={styles.redirectionButtonText}>Inscription</Text>
                <FontAwesome6
                  name="arrow-right-long"
                  size={ms(14)}
                  color={colors.secondary[600]}
                />
              </>
            ) : (
              <>
                <FontAwesome6
                  name="arrow-left-long"
                  size={ms(14)}
                  color={colors.secondary[600]}
                />
                <Text style={styles.redirectionButtonText}>Connexion</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* ScrollView global */}
        <View style={styles.scrollContainer} onLayout={onScrollContainerLayout}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              // Adjust padding based on footer position: less padding when footer is inline
              isScrollable && styles.scrollContentWithInlineFooter,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={onContentSizeChange}
          >
            {/* Container du logo avec effet de profondeur */}
            <View style={styles.logoContainer}>
              <View style={styles.logoShadow}>
                <Image
                  source={require("@assets/logo-without-bg.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Titre simple */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>
                {type === "login" ? "Connexion" : "Inscription"}
              </Text>
            </View>

            {/* Message d'erreur */}
            {error && (
              <View style={styles.errorContainer}>
                <View style={styles.errorIconContainer}>
                  <FontAwesome6
                    name="circle-info"
                    size={ms(16)}
                    color={colors.error}
                  />
                </View>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Formulaire */}
            <View style={styles.formContainer}>
              <View style={styles.childrenContainer}>{children}</View>

              {/* Submit Button */}
              {onSubmit && (
                <Pressable
                  style={[
                    styles.submitButton,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={onSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary[50]}
                    />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        {type === "login" ? "Se connecter" : "S'inscrire"}
                      </Text>
                    </>
                  )}
                </Pressable>
              )}

              {/* Divider with "ou" text */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <GoogleSignIn />
            </View>

            {/* Footer button inside ScrollView when content is scrollable (content > screen height) */}
            {isScrollable && <FooterButton />}
          </ScrollView>

          {/* Footer button absolutely positioned when content fits screen (content <= screen height) */}
          {!isScrollable && <FooterButton />}
        </View>
      </LinearGradient>
    </View>
  );
};

export default AuthFormPresenter;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary[50],
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(24),
  },
  header: {
    paddingTop: ms(20),
  },
  redirectionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: colors.primary[50],
    borderRadius: ms(20),
    borderWidth: ms(1),
    borderColor: colors.secondary[200],
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 3,
  },
  redirectionButtonText: {
    fontSize: ms(14),
    color: colors.secondary[600],
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    marginTop: ms(15),
    position: "relative",
  },
  scrollContent: {
    paddingBottom: ms(80), // Space for absolute footer
  },
  scrollContentWithInlineFooter: {
    paddingBottom: ms(20), // Reduced padding when footer is inline
  },
  logoContainer: {
    marginBottom: ms(24),
    alignSelf: "center",
    width: "auto",
  },
  logoShadow: {
    backgroundColor: colors.primary[50],
    borderRadius: ms(80),
    padding: ms(20),
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(8),
    },
    shadowOpacity: 0.15,
    shadowRadius: ms(16),
    elevation: 8,
    borderWidth: ms(2),
    borderColor: colors.secondary[200],
  },
  logo: {
    width: ms(120),
    height: ms(120),
  },
  titleSection: {
    alignItems: "center",
    marginBottom: ms(24),
  },
  title: {
    fontSize: ms(28),
    fontWeight: "700",
    color: colors.secondary[700],
    marginBottom: ms(8),
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ms(12),
    backgroundColor: colors.primary[50],
    paddingHorizontal: ms(20),
    paddingVertical: ms(16),
    borderRadius: ms(16),
    borderWidth: ms(1),
    borderColor: colors.error,
    marginBottom: ms(24),
    width: "100%",
    shadowColor: colors.tertiary[900],
    shadowOffset: {
      width: 0,
      height: ms(1),
    },
    shadowOpacity: 0.05,
    shadowRadius: ms(8),
    elevation: 1,
  },
  errorIconContainer: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    marginTop: ms(2),
  },
  errorText: {
    color: colors.tertiary[500],
    fontSize: ms(14),
    fontWeight: "500",
    flex: 1,
    lineHeight: ms(20),
    letterSpacing: ms(0.2),
  },
  formContainer: {
    width: "100%",
    backgroundColor: colors.primary[50],
    borderRadius: ms(20),
    padding: ms(24),
    overflow: "hidden",
    borderWidth: ms(2),
    borderColor: colors.tertiary[200],
    shadowColor: colors.tertiary[800],
    shadowOffset: {
      width: 0,
      height: Platform.select<number>({
        ios: ms(4),
        android: ms(2),
        default: ms(4),
      }),
    },
    shadowOpacity: Platform.select({
      ios: 0.25,
      android: 0.15,
    }),
    shadowRadius: Platform.select({
      ios: ms(20),
      android: ms(16),
    }),
    elevation: 3,
  },
  childrenContainer: {
    gap: ms(16),
  },
  submitButton: {
    backgroundColor: colors.secondary[500],
    borderRadius: ms(12),
    paddingVertical: ms(10),
    paddingHorizontal: ms(24),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ms(8),
    marginTop: ms(24),
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: ms(8),
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: colors.tertiary[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: colors.primary[50],
    fontSize: ms(16),
    fontWeight: "600",
  },
  footer: {
    // Absolute positioning for when content fits on screen (not scrollable)
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    marginBottom: ms(25),
  },
  footerInline: {
    // Inline positioning for when content is scrollable (included in ScrollView)
    alignItems: "center",
    marginTop: ms(24),
    marginBottom: ms(20),
  },
  homeButton: {
    borderRadius: ms(25),
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: ms(8),
    elevation: 6,
  },
  homeButtonGradient: {
    borderRadius: ms(25),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
  },
  homeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
  },
  homeButtonIconContainer: {
    width: ms(28),
    height: ms(25),
    borderRadius: ms(14),
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: {
    fontSize: ms(14),
    color: colors.primary[50],
    fontWeight: "600",
    letterSpacing: ms(0.3),
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ms(18),
  },
  dividerLine: {
    flex: 1,
    height: ms(1),
    backgroundColor: colors.tertiary[300],
  },
  dividerText: {
    marginHorizontal: ms(16),
    fontSize: ms(14),
    color: colors.secondary[500],
    fontWeight: "500",
  },
});
