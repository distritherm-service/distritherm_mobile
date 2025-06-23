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
import { useColors } from "src/hooks/useColors";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import Spacer from "../Spacer/Spacer";

interface AuthFormPresenterProps {
  error?: string;
  children: React.ReactNode;
  type: "login" | "register";
  onPressRedirection: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isScrollable: boolean;
  onContentSizeChange: (width: number, height: number) => void;
  onScrollContainerLayout: (event: any) => void;
  errorGoogleSignIn?: string;
  onGoogleSignInError: (errorText: string) => void;
}

const AuthFormPresenter: React.FC<AuthFormPresenterProps> = ({
  error,
  children,
  type,
  onPressRedirection,
  onSubmit,
  isLoading = false,
  isScrollable,
  onContentSizeChange,
  onScrollContainerLayout,
  errorGoogleSignIn,
  onGoogleSignInError,
}) => {
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.primary[50],
    },
    container: {
      flex: 1,
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: ms(40), // Using react-native-size-matters for responsive padding
    },
    scrollContentWithInlineFooter: {
      paddingBottom: ms(100), // Using react-native-size-matters for responsive padding
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: ms(20), // Using react-native-size-matters for responsive margin
      marginTop: ms(20), // Using react-native-size-matters for responsive margin
    },
    logoShadow: {
      shadowColor: colors.tertiary[900],
      shadowOffset: {
        width: 0,
        height: ms(8), // Using react-native-size-matters for responsive shadow
      },
      shadowOpacity: 0.1,
      shadowRadius: ms(16), // Using react-native-size-matters for responsive shadow
      elevation: 8,
    },
    logo: {
      width: ms(160), // Using react-native-size-matters for responsive width
      height: ms(80), // Using react-native-size-matters for responsive height
    },
    titleSection: {
      alignItems: "center",
      marginBottom: ms(32), // Using react-native-size-matters for responsive margin
    },
    title: {
      fontSize: ms(28), // Using react-native-size-matters for responsive font size
      fontWeight: "700",
      color: colors.secondary[700],
      marginBottom: ms(8), // Using react-native-size-matters for responsive margin
      textAlign: "center",
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: ms(12), // Using react-native-size-matters for responsive gap
      backgroundColor: colors.primary[50],
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(16), // Using react-native-size-matters for responsive padding
      borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
      borderWidth: ms(1), // Using react-native-size-matters for responsive border
      borderColor: colors.error,
      marginBottom: ms(24), // Using react-native-size-matters for responsive margin
      width: "100%",
      shadowColor: colors.tertiary[900],
      shadowOffset: {
        width: 0,
        height: ms(1), // Using react-native-size-matters for responsive shadow
      },
      shadowOpacity: 0.05,
      shadowRadius: ms(8), // Using react-native-size-matters for responsive shadow
      elevation: 1,
    },
    errorIconContainer: {
      width: ms(32), // Using react-native-size-matters for responsive width
      height: ms(32), // Using react-native-size-matters for responsive height
      borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
      backgroundColor: colors.error,
      alignItems: "center",
      justifyContent: "center",
      marginTop: ms(2), // Using react-native-size-matters for responsive margin
    },
    errorText: {
      color: colors.tertiary[500],
      fontSize: ms(14), // Using react-native-size-matters for responsive font size
      fontWeight: "500",
      flex: 1,
      lineHeight: ms(20), // Using react-native-size-matters for responsive line height
      letterSpacing: ms(0.2), // Using react-native-size-matters for responsive letter spacing
    },
    formContainer: {
      width: "100%",
      backgroundColor: colors.primary[50],
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      padding: ms(24), // Using react-native-size-matters for responsive padding
      overflow: "hidden",
      borderWidth: ms(2), // Using react-native-size-matters for responsive border
      borderColor: colors.tertiary[200],
      shadowColor: colors.tertiary[800],
      shadowOffset: {
        width: 0,
        height: Platform.select<number>({
          ios: ms(4), // Using react-native-size-matters for responsive shadow
          android: ms(2), // Using react-native-size-matters for responsive shadow
          default: ms(4), // Using react-native-size-matters for responsive shadow
        }),
      },
      shadowOpacity: Platform.select({
        ios: 0.25,
        android: 0.15,
      }),
      shadowRadius: Platform.select({
        ios: ms(20), // Using react-native-size-matters for responsive shadow
        android: ms(16), // Using react-native-size-matters for responsive shadow
      }),
      elevation: 3,
    },
    childrenContainer: {
      gap: ms(16), // Using react-native-size-matters for responsive gap
    },
    submitButton: {
      marginTop: ms(24), // Using react-native-size-matters for responsive margin
      borderRadius: ms(12), // Using react-native-size-matters for responsive border radius
      paddingVertical: ms(14), // Using react-native-size-matters - reduced from 16 to 14
      paddingHorizontal: ms(24), // Using react-native-size-matters for responsive padding
      backgroundColor: colors.secondary[400],
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.secondary[600],
      shadowOffset: {
        width: 0,
        height: ms(6), // Using react-native-size-matters for responsive shadow
      },
      shadowOpacity: 0.3,
      shadowRadius: ms(12), // Using react-native-size-matters for responsive shadow
      elevation: 8,
    },
    submitButtonDisabled: {
      backgroundColor: colors.tertiary[300],
      shadowOpacity: 0.1,
      elevation: 2,
    },
    submitButtonText: {
      color: colors.primary[50],
      fontSize: ms(16), // Using react-native-size-matters for responsive font size
      fontWeight: "700",
      letterSpacing: ms(0.5), // Using react-native-size-matters for responsive letter spacing
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: ms(24), // Using react-native-size-matters for responsive margin
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: ms(16), // Using react-native-size-matters for responsive margin
      color: colors.textSecondary,
      fontSize: ms(14), // Using react-native-size-matters for responsive font size
      fontWeight: "500",
    },
    googleSignInError: {
      color: colors.error,
      fontSize: ms(12), // Using react-native-size-matters for responsive font size
      marginTop: ms(8), // Using react-native-size-matters for responsive margin
      textAlign: "center",
    },
    stickyRedirectionContainer: {
      position: "absolute",
      top: ms(10), // Using react-native-size-matters for responsive positioning
      zIndex: 999,
    },
    stickyRedirectionRight: {
      right: ms(20), // Using react-native-size-matters for responsive positioning
    },
    stickyRedirectionLeft: {
      left: ms(20), // Using react-native-size-matters for responsive positioning
    },
    stickyRedirectionButton: {
      borderRadius: ms(25), // Using react-native-size-matters for responsive border radius
      overflow: "hidden",
      shadowColor: colors.tertiary[800],
      shadowOffset: {
        width: 0,
        height: ms(4), // Using react-native-size-matters for responsive shadow
      },
      shadowOpacity: 0.15,
      shadowRadius: ms(8), // Using react-native-size-matters for responsive shadow
      elevation: 6,
    },
    stickyRedirectionGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: ms(12), // Using react-native-size-matters for responsive padding
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      gap: ms(8), // Using react-native-size-matters for responsive gap
      borderWidth: ms(1), // Using react-native-size-matters for responsive border
      borderColor: colors.secondary[300],
      borderRadius: ms(25), // Using react-native-size-matters for responsive border radius
    },
    stickyRedirectionText: {
      fontSize: ms(13), // Using react-native-size-matters for responsive font size
      fontWeight: "600",
      color: colors.secondary[600],
      letterSpacing: ms(0.3), // Using react-native-size-matters for responsive letter spacing
    },
  });

  // Sticky redirection button component
  const StickyRedirectionButton = () => (
    <View style={[
      dynamicStyles.stickyRedirectionContainer,
      type === "login" ? dynamicStyles.stickyRedirectionRight : dynamicStyles.stickyRedirectionLeft
    ]}>
      <Pressable
        style={dynamicStyles.stickyRedirectionButton}
        onPress={onPressRedirection}
      >
        <LinearGradient
          colors={[colors.primary[50], colors.primary[100]]}
          style={dynamicStyles.stickyRedirectionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {type === "login" ? (
            <>
              <Text style={dynamicStyles.stickyRedirectionText}>Inscription</Text>
              <FontAwesome6
                name="arrow-right-long"
                size={ms(13)} // Using react-native-size-matters for responsive icon size
                color={colors.secondary[600]}
              />
            </>
          ) : (
            <>
              <FontAwesome6
                name="arrow-left-long"
                size={ms(13)} // Using react-native-size-matters for responsive icon size
                color={colors.secondary[600]}
              />
              <Text style={dynamicStyles.stickyRedirectionText}>Connexion</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <View style={dynamicStyles.safeArea}>
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100], colors.primary[200]]}
        style={dynamicStyles.container}
      >
        {/* Sticky redirection button fixed to screen */}
        <StickyRedirectionButton />

        {/* Spacer pour créer un espace entre le bouton sticky et le contenu */}

        {/* ScrollView global */}
        <View style={dynamicStyles.scrollContainer} onLayout={onScrollContainerLayout}>
          <ScrollView
            contentContainerStyle={[
              dynamicStyles.scrollContent,
              isScrollable && dynamicStyles.scrollContentWithInlineFooter,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={onContentSizeChange}
          >
            {/* Spacer pour créer un espace entre le bouton sticky et le contenu */}
            <Spacer height={45} />


            {/* Container du logo avec effet de profondeur */}
            <View style={dynamicStyles.logoContainer}>
              <View style={dynamicStyles.logoShadow}>
                <Image
                  source={require("@assets/logo-without-bg.png")}
                  style={dynamicStyles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Titre simple */}
            <View style={dynamicStyles.titleSection}>
              <Text style={dynamicStyles.title}>
                {type === "login" ? "Connexion" : "Inscription"}
              </Text>
            </View>

            {/* Message d'erreur */}
            {error && (
              <View style={dynamicStyles.errorContainer}>
                <View style={dynamicStyles.errorIconContainer}>
                  <FontAwesome6
                    name="triangle-exclamation"
                    size={ms(16)} // Using react-native-size-matters for responsive icon size
                    color={colors.primary[50]}
                  />
                </View>
                <Text style={dynamicStyles.errorText}>{error}</Text>
              </View>
            )}

            {/* Formulaire */}
            <View style={dynamicStyles.formContainer}>
              <View style={dynamicStyles.childrenContainer}>{children}</View>

              {/* Submit Button */}
              {onSubmit && (
                <Pressable
                  style={[
                    dynamicStyles.submitButton,
                    isLoading && dynamicStyles.submitButtonDisabled,
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
                      <Text style={dynamicStyles.submitButtonText}>
                        {type === "login" ? "Se connecter" : "S'inscrire"}
                      </Text>
                    </>
                  )}
                </Pressable>
              )}

              {/* Divider with "ou" text */}
              <View style={dynamicStyles.dividerContainer}>
                <View style={dynamicStyles.dividerLine} />
                <Text style={dynamicStyles.dividerText}>ou</Text>
                <View style={dynamicStyles.dividerLine} />
              </View>

              <GoogleSignIn onSignInError={onGoogleSignInError} />

              {errorGoogleSignIn && (
                <Text style={dynamicStyles.googleSignInError}>{errorGoogleSignIn}</Text>
              )}
            </View>

          </ScrollView>

        </View>
      </LinearGradient>
    </View>
  );
};

export default AuthFormPresenter;
