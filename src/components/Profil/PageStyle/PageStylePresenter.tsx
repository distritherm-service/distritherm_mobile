import React from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { ms } from "react-native-size-matters";
import { User } from "src/types/User";
import colors from "src/utils/colors";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";

interface PageStylePresenterProps {
  children?: React.ReactNode;
  user?: User;
  heightPercentage?: number;
  logoSize?: {
    width: number;
    height: number;
  };
  handleImagePress: () => void;
}

const PageStylePresenter: React.FC<PageStylePresenterProps> = ({
  children,
  user,
  heightPercentage = 0.25,
  logoSize = { width: ms(120), height: ms(120) },
  handleImagePress,
}) => {
  // Fonction pour formater le rôle utilisateur

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header simplifié avec seulement le logo */}
        <LinearGradient
          colors={[
            colors.tertiary[100],
            colors.tertiary[200],
            colors.primary[100],
          ]}
          style={[
            styles.headerGradient,
            { height: `${heightPercentage * 100}%` },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Logo de l'entreprise */}
          <View style={styles.logoContainer}>
            <View style={styles.logoShadow}>
              <Image
                source={require("../../../../assets/logo-without-bg.png")}
                style={[{ width: logoSize.width, height: logoSize.height }]}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>

        {/* Contenu principal avec effet flottant moderne */}
        <View style={styles.contentWrapper}>
          <View style={styles.contentContainer}>
            {/* Informations utilisateur si connecté - maintenant dans le contenu */}
            {user && (
              <View style={styles.userInfoSection}>
                {/* Photo de profil avec bordure élégante */}
                <View style={styles.profileImageContainer}>
                  <LinearGradient
                    colors={[colors.primary[50], colors.primary[200]]}
                    style={styles.profileImageBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image
                      source={{ uri: user.urlPicture || NO_IMAGE_URL }}
                      style={styles.profileImage}
                    />
                  </LinearGradient>

                  {/* Icône caméra positionnée au-dessus */}
                  <Pressable style={styles.cameraIconContainer} onPress={() => handleImagePress()}>
                    <LinearGradient
                      colors={[colors.tertiary[400], colors.tertiary[600]]}
                      style={styles.cameraIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome6
                        name="camera"
                        size={ms(12)}
                        color={colors.primary[50]}
                      />
                    </LinearGradient>
                  </Pressable>
                </View>

                {/* Informations textuelles */}
                <View style={styles.userTextInfo}>
                  <Text style={styles.userName}>
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "Utilisateur"}
                  </Text>
                </View>

                {/* Séparateur élégant */}
                <View style={styles.userInfoSeparator}>
                  <LinearGradient
                    colors={[
                      colors.primary[100],
                      colors.tertiary[200],
                      colors.primary[100],
                    ]}
                    style={styles.separatorLine}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            )}

            {/* Contenu des enfants */}
            <View style={styles.childrenContainer}>{children}</View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PageStylePresenter;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: ms(30),
    paddingBottom: ms(50), // Réduit car plus d'infos utilisateur
    paddingHorizontal: ms(24),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(6) },
    shadowOpacity: 0.08,
    shadowRadius: ms(12),
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoShadow: {
    backgroundColor: colors.primary[50],
    borderRadius: ms(60),
    padding: ms(16),
    shadowColor: colors.tertiary[700],
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.12,
    shadowRadius: ms(10),
    elevation: 5,
    borderWidth: ms(1),
    borderColor: colors.primary[200],
  },
  contentWrapper: {
    flex: 1,
    marginTop: ms(-24),
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: colors.primary[50],
    borderTopLeftRadius: ms(32),
    borderTopRightRadius: ms(32),
    padding: ms(20),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(-8) },
    shadowOpacity: 0.12,
    shadowRadius: ms(16),
    elevation: 8,
  },
  userInfoSection: {
    alignItems: "center",
    marginBottom: ms(32),
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: ms(16),
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageBorder: {
    padding: ms(4),
    borderRadius: ms(64),
    shadowColor: colors.tertiary[700],
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.15,
    shadowRadius: ms(8),
    elevation: 6,
    zIndex: 1,
  },
  profileImage: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(56),
    backgroundColor: colors.primary[100],
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: ms(4),
    right: ms(4),
    borderRadius: ms(20),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.25,
    shadowRadius: ms(8),
    elevation: 10, // Plus élevé que l'image pour iOS
    zIndex: 10, // Z-index élevé pour iOS
  },
  cameraIconGradient: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: ms(2),
    borderColor: colors.primary[50],
  },
  userTextInfo: {
    alignItems: "center",
    gap: ms(8),
  },
  userName: {
    fontSize: ms(26), // Légèrement plus grand dans le contenu
    fontWeight: "700",
    color: colors.tertiary[800],
    textAlign: "center",
    letterSpacing: ms(0.5),
    marginBottom: ms(4),
  },
  userRoleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    backgroundColor: colors.primary[100],
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderRadius: ms(20),
    shadowColor: colors.tertiary[600],
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.08,
    shadowRadius: ms(6),
    elevation: 3,
    borderWidth: ms(1),
    borderColor: colors.primary[300],
  },
  roleIcon: {
    // Utilise react-native-size-matters pour la responsivité
  },
  userRole: {
    fontSize: ms(15), // Légèrement plus grand
    fontWeight: "600",
    color: colors.tertiary[700],
    letterSpacing: ms(0.3),
  },
  userEmailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(8),
    maxWidth: "90%",
    backgroundColor: colors.primary[100],
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: ms(16),
    borderWidth: ms(1),
    borderColor: colors.primary[300],
  },
  emailIcon: {
    opacity: 0.8,
    // Utilise react-native-size-matters pour la responsivité
  },
  userEmail: {
    fontSize: ms(14), // Légèrement plus grand
    color: colors.tertiary[600],
    fontWeight: "500",
    letterSpacing: ms(0.2),
  },
  userInfoSeparator: {
    width: "100%",
    alignItems: "center",
    marginTop: ms(24),
  },
  separatorLine: {
    height: ms(2),
    width: "60%",
    borderRadius: ms(1),
  },
  childrenContainer: {
    flex: 1,
  },
});
