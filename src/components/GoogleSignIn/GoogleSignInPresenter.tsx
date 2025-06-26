import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import React, { memo } from "react";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Control, FieldErrors } from "react-hook-form";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import {
  faBuilding,
  faPhone,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

interface FormData {
  companyName: string;
  siretNumber: string;
  phoneNumber: string;
}

interface GoogleSignInPresenterProps {
  isLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
  completeInformation: boolean;
  setCompleteInformation: (value: boolean) => void;
  // Form props
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  formRules: {
    companyName: object;
    siretNumber: object;
    phoneNumber: object;
  };
  onSubmit: () => void;
  onModalClose: () => void;
}

const GoogleSignInPresenter = memo<GoogleSignInPresenterProps>(
  ({
    isLoading,
    handleGoogleSignIn,
    completeInformation,
    setCompleteInformation,
    control,
    errors,
    formRules,
    onSubmit,
    onModalClose,
  }) => {
    const colors = useColors(); // Using react-native-size-matters for responsive design

    // Dynamic styles using colors from useColors hook
    const dynamicStyles = StyleSheet.create({
      container: {
        width: "100%",
      },
      button: {
        width: "100%",
        borderRadius: ms(12), // Using react-native-size-matters for responsive border radius
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
      gradient: {
        paddingVertical: ms(12), // Using react-native-size-matters - reduced from 14 to 12
        paddingHorizontal: ms(24), // Using react-native-size-matters for responsive padding
        borderWidth: ms(1), // Using react-native-size-matters for responsive border
        borderColor: colors.secondary[200],
        borderRadius: ms(12), // Using react-native-size-matters for responsive border radius
      },
      content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: ms(12), // Using react-native-size-matters for responsive gap
      },
      iconContainer: {
        width: ms(24), // Using react-native-size-matters for responsive width
        height: ms(24), // Using react-native-size-matters for responsive height
        borderRadius: ms(12), // Using react-native-size-matters for responsive border radius
        backgroundColor: colors.primary[50],
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.secondary[400],
        shadowOffset: {
          width: 0,
          height: ms(2), // Using react-native-size-matters for responsive shadow
        },
        shadowOpacity: 0.2,
        shadowRadius: ms(4), // Using react-native-size-matters for responsive shadow
        elevation: 3,
      },
      text: {
        fontSize: ms(15), // Using react-native-size-matters for responsive font size
        fontWeight: "600",
        color: colors.secondary[600],
        letterSpacing: ms(0.3), // Using react-native-size-matters for responsive letter spacing
      },
      modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Lighter backdrop for minimalistic feel
        justifyContent: "center",
        alignItems: "center",
        padding: ms(20), // Using react-native-size-matters for responsive padding
      },
      modalContainer: {
        backgroundColor: colors.background,
        borderRadius: ms(16), // Using react-native-size-matters - clean rounded corners
        width: "95%",
        maxHeight: "85%", // Prevent modal from being too tall
        shadowColor: colors.tertiary[500],
        shadowOffset: {
          width: 0,
          height: ms(8), // Using react-native-size-matters
        },
        shadowOpacity: 0.1,
        shadowRadius: ms(16), // Using react-native-size-matters
        elevation: 8,
        borderWidth: ms(1), // Using react-native-size-matters
        borderColor: colors.border,
        overflow: "visible", // Allow content to be visible if it expands
      },
      modalHeader: {
        alignItems: "center",
        paddingTop: ms(24), // Using react-native-size-matters
        paddingHorizontal: ms(24), // Using react-native-size-matters
        paddingBottom: ms(16), // Using react-native-size-matters
        borderBottomWidth: ms(1), // Using react-native-size-matters
        borderBottomColor: colors.border,
      },
      closeButton: {
        position: "absolute",
        top: ms(12), // Using react-native-size-matters
        right: ms(12), // Using react-native-size-matters
        width: ms(32), // Using react-native-size-matters
        height: ms(32), // Using react-native-size-matters
        borderRadius: ms(16), // Using react-native-size-matters
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: ms(1), // Using react-native-size-matters
        borderColor: colors.border,
      },
      iconWrapper: {
        width: ms(56), // Using react-native-size-matters - smaller, more minimalistic
        height: ms(56), // Using react-native-size-matters
        borderRadius: ms(28), // Using react-native-size-matters
        backgroundColor: colors.secondary[50],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: ms(12), // Using react-native-size-matters
        borderWidth: ms(2), // Using react-native-size-matters
        borderColor: colors.secondary[200],
      },
      modalTitle: {
        fontSize: ms(18), // Using react-native-size-matters - smaller, cleaner
        fontWeight: "700",
        color: colors.text,
        textAlign: "center",
        marginBottom: ms(4), // Using react-native-size-matters
      },
      modalSubtitle: {
        fontSize: ms(14), // Using react-native-size-matters
        fontWeight: "400",
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: ms(20), // Using react-native-size-matters
      },
      modalBody: {
        padding: ms(24), // Using react-native-size-matters
      },
      formContainer: {
        gap: ms(18), // Using react-native-size-matters - tighter spacing
      },
      // Custom Input Container Style for Modal
      modalInputContainer: {
        marginBottom: ms(16), // Using react-native-size-matters
      },
      modalInputStyle: {
        minHeight: ms(48), // Using react-native-size-matters - fixed minimum height
        flex: 0, // Remove flex to prevent layout issues in modal
      },
      modalFooter: {
        flexDirection: "row",
        padding: ms(24), // Using react-native-size-matters
        paddingTop: ms(16), // Using react-native-size-matters
        borderTopWidth: ms(1), // Using react-native-size-matters
        borderTopColor: colors.border,
        gap: ms(12), // Using react-native-size-matters
      },
      modalButton: {
        flex: 1,
        paddingVertical: ms(14), // Using react-native-size-matters
        borderRadius: ms(8), // Using react-native-size-matters
        alignItems: "center",
        justifyContent: "center",
        minHeight: ms(48), // Using react-native-size-matters
      },
      cancelButton: {
        backgroundColor: colors.surface,
        borderWidth: ms(1), // Using react-native-size-matters
        borderColor: colors.border,
      },
      cancelButtonText: {
        fontSize: ms(15), // Using react-native-size-matters
        fontWeight: "600",
        color: colors.textSecondary,
      },
      confirmButton: {
        backgroundColor: colors.secondary[400],
        shadowColor: colors.secondary[600],
        shadowOffset: {
          width: 0,
          height: ms(3), // Using react-native-size-matters
        },
        shadowOpacity: 0.25,
        shadowRadius: ms(6), // Using react-native-size-matters
        elevation: 5,
        borderWidth: ms(1), // Using react-native-size-matters
        borderColor: colors.secondary[500],
      },
      confirmButtonText: {
        fontSize: ms(15), // Using react-native-size-matters
        fontWeight: "700",
        color: "#FFFFFF", // Explicit white color for better contrast
        textAlign: "center",
        letterSpacing: ms(0.3), // Using react-native-size-matters
      },
    });

    return (
      <View style={dynamicStyles.container}>
        <Pressable style={dynamicStyles.button} onPress={handleGoogleSignIn}>
          <LinearGradient
            colors={[colors.primary[50], colors.primary[100]]}
            style={dynamicStyles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={dynamicStyles.content}>
              {isLoading ? (
                <ActivityIndicator
                  size={ms(25)}
                  color={colors.secondary[400]}
                />
              ) : (
                <>
                  <View style={dynamicStyles.iconContainer}>
                    <FontAwesome6
                      name="google"
                      size={ms(18)} // Using react-native-size-matters for responsive icon size
                      color={colors.secondary[400]}
                    />
                  </View>
                  <Text style={dynamicStyles.text}>Continuer avec Google</Text>
                </>
              )}
            </View>
          </LinearGradient>
        </Pressable>

        <Modal
          visible={completeInformation}
          onRequestClose={onModalClose}
          transparent={true}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={onModalClose}>
            <View style={dynamicStyles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={dynamicStyles.modalContainer}>
                  {/* Close Button */}
                  <Pressable
                    style={dynamicStyles.closeButton}
                    onPress={onModalClose}
                  >
                    <FontAwesome6
                      name="xmark"
                      size={ms(16)} // Using react-native-size-matters for responsive icon size
                      color={colors.textSecondary}
                    />
                  </Pressable>

                  {/* Header */}
                  <View style={dynamicStyles.modalHeader}>
                    <View style={dynamicStyles.iconWrapper}>
                      <FontAwesome6
                        name="building"
                        size={ms(24)} // Using react-native-size-matters for responsive icon size
                        color={colors.secondary[400]}
                      />
                    </View>

                    <Text style={dynamicStyles.modalTitle}>
                      Compléter votre profil
                    </Text>
                    <Text style={dynamicStyles.modalSubtitle}>
                      Informations sur votre entreprise pour finaliser votre
                      inscription
                    </Text>
                  </View>

                  {/* Body */}
                  <View style={dynamicStyles.modalBody}>
                    {/* Form Fields using Input component with modal-specific styling */}
                    <View style={dynamicStyles.formContainer}>
                      <Input<FormData>
                        name="companyName"
                        control={control}
                        label="Nom de l'entreprise *"
                        placeholder="Ex: Ma Société SARL"
                        leftLogo={faBuilding}
                        rules={formRules.companyName}
                        type={InputType.DEFAULT}
                      />

                      <Input<FormData>
                        name="siretNumber"
                        control={control}
                        label="Numéro SIRET *"
                        placeholder="12345678901234"
                        leftLogo={faIdCard}
                        rules={formRules.siretNumber}
                        type={InputType.NUMERIC}
                        maxLength={14}
                      />

                      <Input<FormData>
                        name="phoneNumber"
                        control={control}
                        label="Numéro de téléphone *"
                        placeholder="06 12 34 56 78"
                        leftLogo={faPhone}
                        rules={formRules.phoneNumber}
                        type={InputType.DEFAULT}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={dynamicStyles.modalFooter}>
                    <Pressable
                      style={[
                        dynamicStyles.modalButton,
                        dynamicStyles.cancelButton,
                      ]}
                      onPress={onModalClose}
                    >
                      <Text style={dynamicStyles.cancelButtonText}>
                        Annuler
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        dynamicStyles.modalButton,
                        dynamicStyles.confirmButton,
                      ]}
                      onPress={onSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator
                          size={ms(16)}
                          color={colors.primary[50]}
                        />
                      ) : (
                        <Text style={dynamicStyles.confirmButtonText}>
                          Créer mon compte
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
);

export default GoogleSignInPresenter;
