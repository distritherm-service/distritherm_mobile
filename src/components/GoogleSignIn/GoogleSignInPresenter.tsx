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
        paddingVertical: ms(16), // Using react-native-size-matters for responsive padding
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: ms(20), // Using react-native-size-matters for responsive padding
      },
      modalContainer: {
        backgroundColor: colors.primary[50],
        borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
        maxWidth: ms(400), // Using react-native-size-matters for responsive max width
        width: "100%",
        shadowColor: colors.tertiary[900],
        shadowOffset: {
          width: 0,
          height: ms(8), // Using react-native-size-matters for responsive shadow
        },
        shadowOpacity: 0.25,
        shadowRadius: ms(16), // Using react-native-size-matters for responsive shadow
        elevation: 10,
      },
      modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ms(24), // Using react-native-size-matters for responsive padding
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      modalTitle: {
        fontSize: ms(18), // Using react-native-size-matters for responsive font size
        fontWeight: "700",
        color: colors.tertiary[500],
      },
      closeButton: {
        width: ms(32), // Using react-native-size-matters for responsive width
        height: ms(32), // Using react-native-size-matters for responsive height
        borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.border,
      },
      modalBody: {
        padding: ms(24), // Using react-native-size-matters for responsive padding
      },
      iconWrapper: {
        alignSelf: "center",
        width: ms(64), // Using react-native-size-matters for responsive width
        height: ms(64), // Using react-native-size-matters for responsive height
        borderRadius: ms(32), // Using react-native-size-matters for responsive border radius
        backgroundColor: colors.secondary[50],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: ms(16), // Using react-native-size-matters for responsive margin
        borderWidth: ms(2), // Using react-native-size-matters for responsive border
        borderColor: colors.secondary[200],
      },
      modalDescription: {
        fontSize: ms(14), // Using react-native-size-matters for responsive font size
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: ms(20), // Using react-native-size-matters for responsive line height
        marginBottom: ms(24), // Using react-native-size-matters for responsive margin
      },
      formContainer: {
        gap: ms(16), // Using react-native-size-matters for responsive gap
      },
      modalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: ms(12), // Using react-native-size-matters for responsive gap
        padding: ms(24), // Using react-native-size-matters for responsive padding
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      modalButton: {
        flex: 1,
        paddingVertical: ms(12), // Using react-native-size-matters for responsive padding
        borderRadius: ms(8), // Using react-native-size-matters for responsive border radius
        alignItems: "center",
        justifyContent: "center",
        minHeight: ms(44), // Using react-native-size-matters for responsive height
      },
      cancelButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      },
      cancelButtonText: {
        fontSize: ms(16), // Using react-native-size-matters for responsive font size
        fontWeight: "600",
        color: colors.textSecondary,
      },
      confirmButton: {
        backgroundColor: colors.secondary[400],
        shadowColor: colors.secondary[600],
        shadowOffset: {
          width: 0,
          height: ms(4), // Using react-native-size-matters for responsive shadow
        },
        shadowOpacity: 0.3,
        shadowRadius: ms(8), // Using react-native-size-matters for responsive shadow
        elevation: 6,
      },
      confirmButtonText: {
        fontSize: ms(16), // Using react-native-size-matters for responsive font size
        fontWeight: "700",
        color: colors.primary[50],
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
                <ActivityIndicator size={ms(25)} color={colors.secondary[400]} />
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
        >
          <TouchableWithoutFeedback onPress={onModalClose}>
            <View style={dynamicStyles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={dynamicStyles.modalContainer}>
                  {/* Modal Header */}
                  <View style={dynamicStyles.modalHeader}>
                    <Text style={dynamicStyles.modalTitle}>
                      Compléter votre profil
                    </Text>
                    <Pressable
                      style={dynamicStyles.closeButton}
                      onPress={onModalClose}
                    >
                      <FontAwesome6
                        name="xmark"
                        size={ms(16)} // Using react-native-size-matters for responsive icon size
                        color={colors.secondary[600]}
                      />
                    </Pressable>
                  </View>

                  {/* Modal Body */}
                  <View style={dynamicStyles.modalBody}>
                    <View style={dynamicStyles.iconWrapper}>
                      <FontAwesome6
                        name="building"
                        size={ms(32)} // Using react-native-size-matters for responsive icon size
                        color={colors.primary[500]}
                      />
                    </View>
                    <Text style={dynamicStyles.modalDescription}>
                      Veuillez compléter les informations de votre entreprise
                      pour finaliser votre inscription.
                    </Text>

                    {/* Form Fields using Input component with validation rules (errors shown only on submit) */}
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

                  {/* Modal Footer */}
                  <View style={dynamicStyles.modalFooter}>
                    <Pressable
                      style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
                      onPress={onModalClose}
                    >
                      <Text style={dynamicStyles.cancelButtonText}>Annuler</Text>
                    </Pressable>
                    <Pressable
                      style={[dynamicStyles.modalButton, dynamicStyles.confirmButton]}
                      onPress={onSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size={ms(16)} color={colors.primary[50]} />
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
