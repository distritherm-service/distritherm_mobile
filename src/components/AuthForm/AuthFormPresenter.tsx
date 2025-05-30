import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import React from "react";
import colors from "src/utils/colors";
import { ms } from "react-native-size-matters";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface AuthFormPresenterProps {
  error?: string;
  children: React.ReactNode;
  type: "login" | "register";
  onPressLoginRedirection: () => void;
  onGoBack: () => void;
}

const AuthFormPresenter: React.FC<AuthFormPresenterProps> = ({
  error,
  children,
  type,
  onPressLoginRedirection,
  onGoBack,
}) => {
  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100], colors.primary[200]]}
        style={styles.container}
      >
        {/* Header avec bouton de redirection à gauche */}
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

        {/* Section principale avec logo et formulaire */}
        <View style={styles.mainContent}>
          {/* Indicateur de page actuelle */}
          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {type === "login" ? "CONNEXION" : "INSCRIPTION"}
            </Text>
          </View>

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

          {/* Titre de bienvenue */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              {type === "login" ? "Bon retour !" : "Bienvenue !"}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {type === "login"
                ? "Connectez-vous à votre compte"
                : "Créez votre compte pour commencer"}
            </Text>
          </View>

          {/* Message d'erreur avec style amélioré */}
          {error && (
            <View style={styles.errorContainer}>
              <FontAwesome6
                name="circle-exclamation"
                size={ms(16)}
                color={colors.tertiary[700]}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Formulaire */}
          <View style={styles.formContainer}>{children}</View>
        </View>

        {/* Bouton de retour à l'accueil en bas */}
        <View style={styles.footer}>
          <Pressable style={styles.homeButton} onPress={onGoBack}>
            <FontAwesome6
              name="arrow-left"
              size={ms(16)}
              color={colors.secondary[600]}
            />
            <Text style={styles.homeButtonText}>Retour en arrière</Text>
          </Pressable>
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
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: ms(20),
  },
  pageIndicator: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: ms(20),
    paddingVertical: ms(8),
    borderRadius: ms(20),
    marginBottom: ms(24),
    borderWidth: ms(1),
    borderColor: colors.primary[500],
  },
  pageIndicatorText: {
    fontSize: ms(12),
    fontWeight: "700",
    color: colors.secondary[700],
    letterSpacing: ms(1),
  },
  logoContainer: {
    marginBottom: ms(24),
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
  welcomeSection: {
    alignItems: "center",
    marginBottom: ms(24),
  },
  welcomeTitle: {
    fontSize: ms(28),
    fontWeight: "700",
    color: colors.secondary[700],
    marginBottom: ms(8),
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: ms(16),
    color: colors.secondary[500],
    textAlign: "center",
    lineHeight: ms(22),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    backgroundColor: colors.primary[100],
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderRadius: ms(12),
    borderLeftWidth: ms(4),
    borderLeftColor: colors.tertiary[700],
    marginBottom: ms(24),
    width: "100%",
  },
  errorText: {
    color: colors.tertiary[800],
    fontSize: ms(14),
    fontWeight: "500",
    flex: 1,
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
  footer: {
    paddingBottom: ms(20),
    alignItems: "center",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
    backgroundColor: "transparent",
    borderRadius: ms(25),
    borderWidth: ms(1),
    borderColor: colors.secondary[300],
  },
  homeButtonText: {
    fontSize: ms(14),
    color: colors.secondary[600],
    fontWeight: "500",
  },
});
