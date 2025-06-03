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
import colors from "src/utils/colors";
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

        <Modal
          visible={completeInformation}
          onRequestClose={onModalClose}
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={onModalClose}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContainer}>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      Compléter votre profil
                    </Text>
                    <Pressable
                      style={styles.closeButton}
                      onPress={onModalClose}
                    >
                      <FontAwesome6
                        name="xmark"
                        size={ms(16)}
                        color={colors.secondary[600]}
                      />
                    </Pressable>
                  </View>

                  {/* Modal Body */}
                  <View style={styles.modalBody}>
                    <View style={styles.iconWrapper}>
                      <FontAwesome6
                        name="building"
                        size={ms(32)}
                        color={colors.primary[500]}
                      />
                    </View>
                    <Text style={styles.modalDescription}>
                      Veuillez compléter les informations de votre entreprise
                      pour finaliser votre inscription.
                    </Text>

                    {/* Form Fields using Input component with validation rules (errors shown only on submit) */}
                    <View style={styles.formContainer}>
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
                  <View style={styles.modalFooter}>
                    <Pressable
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={onModalClose}
                    >
                      <Text style={styles.cancelButtonText}>Annuler</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={onSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size={ms(16)} color="white" />
                      ) : (
                        <Text style={styles.confirmButtonText}>
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
    color: colors.secondary[600],
    fontWeight: "600",
    letterSpacing: ms(0.3),
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: ms(400),
    padding: ms(20),
    backgroundColor: "white",
    borderRadius: ms(20),
    shadowColor: colors.secondary[800],
    shadowOffset: {
      width: 0,
      height: ms(8),
    },
    shadowOpacity: 0.25,
    shadowRadius: ms(16),
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ms(20),
  },
  modalTitle: {
    fontSize: ms(18),
    fontWeight: "700",
    color: colors.secondary[800],
  },
  closeButton: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: colors.tertiary[100],
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    alignItems: "center",
    marginBottom: ms(24),
  },
  iconWrapper: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ms(16),
  },
  modalDescription: {
    fontSize: ms(14),
    color: colors.secondary[600],
    textAlign: "center",
    lineHeight: ms(20),
    marginBottom: ms(20),
  },
  formContainer: {
    width: "100%",
    gap: ms(20),
  },
  modalFooter: {
    flexDirection: "row",
    gap: ms(12),
  },
  modalButton: {
    flex: 1,
    paddingVertical: ms(12),
    borderRadius: ms(12),
    alignItems: "center",
    justifyContent: "center",
    minHeight: ms(44),
  },
  cancelButton: {
    backgroundColor: colors.tertiary[100],
    borderWidth: ms(1),
    borderColor: colors.tertiary[300],
  },
  confirmButton: {
    backgroundColor: colors.secondary[600],
  },
  disabledButton: {
    backgroundColor: colors.tertiary[300],
  },
  cancelButtonText: {
    fontSize: ms(14),
    fontWeight: "600",
    color: colors.tertiary[600],
  },
  confirmButtonText: {
    fontSize: ms(14),
    fontWeight: "600",
    color: colors.primary[50],
  },
  disabledButtonText: {
    color: colors.secondary[400],
  },
});
