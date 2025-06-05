import React from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ms } from "react-native-size-matters";
import { User, UserWithClientDto } from "src/types/User";
import colors from "src/utils/colors";
import { NO_IMAGE_URL } from "src/utils/noImage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faExclamationTriangle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

interface PageStylePresenterProps {
  children?: React.ReactNode;
  user?: UserWithClientDto;
  heightPercentage?: number;
  logoSize?: {
    width: number;
    height: number;
  };
  onOpenModalImagePicker: () => void;
  onCloseModaImagePicker: () => void;
  isModalVisible: boolean;
  onPhoto: () => void;
  onGallery: () => void;
  selectedImage?: string | null;
  deconnectionLoading?: boolean;
  isEmailUnverified?: boolean;
  onResendVerificationEmail?: () => void;
  isResendingEmail?: boolean;
}

const PageStylePresenter: React.FC<PageStylePresenterProps> = ({
  children,
  user,
  heightPercentage = 0.25,
  logoSize = { width: ms(120), height: ms(120) },
  onOpenModalImagePicker,
  onCloseModaImagePicker,
  isModalVisible,
  onPhoto,
  onGallery,
  selectedImage,
  deconnectionLoading = false,
  isEmailUnverified = false,
  onResendVerificationEmail,
  isResendingEmail = false,
}) => {
  // Fonction pour formater le rôle utilisateur

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={false}
        scrollEventThrottle={16}
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
                <Pressable
                  style={styles.profileImageContainer}
                  onPress={onOpenModalImagePicker}
                >
                  <LinearGradient
                    colors={[colors.primary[50], colors.primary[200]]}
                    style={styles.profileImageBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Image
                      source={{
                        uri: selectedImage || user.urlPicture || NO_IMAGE_URL,
                      }}
                      style={styles.profileImage}
                    />
                  </LinearGradient>

                  {/* Icône caméra positionnée au-dessus */}
                  <View style={styles.cameraIconContainer}>
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
                  </View>
                </Pressable>

                {/* Informations textuelles */}
                <View style={styles.userTextInfo}>
                  <Text style={styles.userName}>
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "Utilisateur"}
                  </Text>

                  {/* Email non vérifié - minimaliste et explicite */}
                  {isEmailUnverified && (
                    <TouchableOpacity
                      style={styles.emailVerificationNotice}
                      onPress={onResendVerificationEmail}
                      disabled={isResendingEmail}
                      activeOpacity={0.7}
                    >
                      <View style={styles.emailNoticeContainer}>
                        <View style={styles.emailNoticeHeader}>
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            size={ms(14)}
                            color="#FF6B35"
                          />
                          <Text style={styles.emailNoticeTitle}>
                            Email non vérifié
                          </Text>
                        </View>

                        <View style={styles.emailNoticeButton}>
                          <Text style={styles.emailNoticeButtonText}>
                            {isResendingEmail
                              ? "Envoi en cours..."
                              : "Renvoyer l'email"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
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

      {/* Modal pour sélection d'image */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={onCloseModaImagePicker}
      >
        <Pressable style={styles.modalOverlay} onPress={onCloseModaImagePicker}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity style={styles.modalButton} onPress={onGallery}>
              <FontAwesome6 name="image" size={20} />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={onPhoto}>
              <FontAwesome6 name="camera" size={20} />
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCloseModaImagePicker}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de déconnexion élégant */}
      <Modal
        visible={deconnectionLoading}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.disconnectionModalOverlay}>
          <View style={styles.disconnectionModalContent}>
            <LinearGradient
              colors={[colors.primary[50], colors.primary[100]]}
              style={styles.disconnectionModalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Icône de déconnexion avec animation */}
              <View style={styles.disconnectionIconContainer}>
                <LinearGradient
                  colors={[colors.tertiary[400], colors.tertiary[600]]}
                  style={styles.disconnectionIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="door-open"
                    size={ms(24)}
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </View>

              {/* Texte de déconnexion */}
              <Text style={styles.disconnectionTitle}>
                Déconnexion en cours
              </Text>
              <Text style={styles.disconnectionSubtitle}>
                Veuillez patienter...
              </Text>

              {/* Indicateur de chargement personnalisé */}
              <View>
                <ActivityIndicator size="large" color={colors.tertiary[600]} />
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
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
    minHeight: "100%",
  },
  headerGradient: {
    paddingTop: ms(30),
    paddingBottom: ms(50), // Réduit car bottom en bas
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
    paddingBottom: ms(0),
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
    elevation: 10,
    zIndex: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.primary[50],
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    padding: ms(20),
    paddingBottom: ms(30),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: -ms(4) },
    shadowOpacity: 0.1,
    shadowRadius: ms(8),
    elevation: 5,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(12),
    padding: ms(16),
    backgroundColor: colors.primary[100],
    borderRadius: ms(12),
    marginBottom: ms(12),
    borderWidth: ms(1),
    borderColor: colors.primary[300],
  },
  modalButtonText: {
    fontSize: ms(16),
    color: colors.tertiary[700],
    fontWeight: "500",
  },
  cancelButton: {
    padding: ms(16),
    alignItems: "center",
    backgroundColor: colors.tertiary[100],
    borderRadius: ms(12),
    marginTop: ms(8),
  },
  cancelButtonText: {
    fontSize: ms(16),
    color: colors.tertiary[700],
    fontWeight: "600",
  },
  disconnectionModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  disconnectionModalContent: {
    width: ms(280),
    backgroundColor: colors.primary[50],
    borderRadius: ms(24),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(8) },
    shadowOpacity: 0.15,
    shadowRadius: ms(16),
    elevation: 10,
    overflow: "hidden",
  },
  disconnectionModalGradient: {
    paddingVertical: ms(32),
    paddingHorizontal: ms(24),
    alignItems: "center",
  },
  disconnectionIconContainer: {
    marginBottom: ms(20),
    shadowColor: colors.tertiary[700],
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.2,
    shadowRadius: ms(8),
    elevation: 6,
  },
  disconnectionIconGradient: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: ms(3),
    borderColor: colors.primary[200],
  },
  disconnectionTitle: {
    fontSize: ms(20),
    fontWeight: "700",
    color: colors.tertiary[800],
    textAlign: "center",
    marginBottom: ms(8),
    letterSpacing: ms(0.5),
  },
  disconnectionSubtitle: {
    fontSize: ms(15),
    color: colors.tertiary[600],
    textAlign: "center",
    marginBottom: ms(24),
    fontWeight: "500",
  },
  emailVerificationNotice: {
    minWidth: "100%",
  },
  emailNoticeContainer: {
    flexDirection: "column",
    minWidth: "100%",
    alignItems: "center",
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
    backgroundColor: "#FFF8F0",
    borderRadius: ms(10),
    borderLeftWidth: ms(4),
    borderLeftColor: "#FF6B35",
    gap: ms(10),
  },
  emailNoticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: ms(6),
  },
  emailNoticeTitle: {
    fontSize: ms(13),
    color: "#D2691E",
    fontWeight: "600",
  },
  emailNoticeButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: ms(10),
    paddingHorizontal: ms(12),
    borderRadius: ms(6),
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.2,
    shadowRadius: ms(3),
    elevation: 2,
  },
  emailNoticeButtonText: {
    fontSize: ms(14),
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});
