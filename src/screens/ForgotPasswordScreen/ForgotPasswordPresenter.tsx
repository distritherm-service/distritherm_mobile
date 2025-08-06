import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ms } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { Control } from "react-hook-form";
import { faLock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import Input from "src/components/Input/Input";
import { useColors } from "src/hooks/useColors";
import { InputType } from "src/types/InputType";
import { ChangePasswordFormData } from "./ForgotPassword";

interface ForgotPasswordPresenterProps {
  control: Control<ChangePasswordFormData>;
  isLoading: boolean;
  onChangePassword: () => void;
  onBack: () => void;
  validationRules: any;
  validatePasswordMatch: (value: string) => string | true;
  validateNewPasswordDifferent: (value: string) => string | true;
}

const ForgotPasswordPresenter: React.FC<ForgotPasswordPresenterProps> = ({
  control,
  isLoading,
  onChangePassword,
  onBack,
  validationRules,
  validatePasswordMatch,
  validateNewPasswordDifferent,
}) => {
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.tertiary[50],
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: ms(20), // Using react-native-size-matters for responsive padding
      paddingBottom: ms(40), // Using react-native-size-matters for responsive padding
    },
    headerSection: {
      marginBottom: ms(24), // Using react-native-size-matters for responsive margin
    },
    headerGradient: {
      padding: ms(28), // Using react-native-size-matters for responsive padding
      borderRadius: ms(24), // Using react-native-size-matters for responsive border radius
      alignItems: "center",
      shadowColor: colors.tertiary[800],
      shadowOffset: { width: 0, height: ms(8) }, // Using react-native-size-matters for responsive shadow
      shadowOpacity: 0.12,
      shadowRadius: ms(16), // Using react-native-size-matters for responsive shadow
      elevation: 8,
      borderWidth: ms(1), // Using react-native-size-matters for responsive border
      borderColor: colors.primary[200],
    },
    iconWrapper: {
      marginBottom: ms(16), // Using react-native-size-matters for responsive margin
      shadowColor: colors.secondary[600],
      shadowOffset: { width: 0, height: ms(4) }, // Using react-native-size-matters for responsive shadow
      shadowOpacity: 0.3,
      shadowRadius: ms(8), // Using react-native-size-matters for responsive shadow
      elevation: 6,
    },
    iconGradient: {
      width: ms(56), // Using react-native-size-matters for responsive width
      height: ms(56), // Using react-native-size-matters for responsive height
      borderRadius: ms(28), // Using react-native-size-matters for responsive border radius
      alignItems: "center",
      justifyContent: "center",
      borderWidth: ms(2), // Using react-native-size-matters for responsive border
      borderColor: colors.primary[50],
    },
    headerTitle: {
      fontSize: ms(24), // Using react-native-size-matters for responsive font size
      fontWeight: "800",
      color: colors.tertiary[800],
      marginBottom: ms(8), // Using react-native-size-matters for responsive margin
      textAlign: "center",
      letterSpacing: ms(0.5), // Using react-native-size-matters for responsive letter spacing
    },
    headerSubtitle: {
      fontSize: ms(15), // Using react-native-size-matters for responsive font size
      color: colors.tertiary[600],
      textAlign: "center",
      lineHeight: ms(22), // Using react-native-size-matters for responsive line height
      paddingHorizontal: ms(10), // Using react-native-size-matters for responsive padding
    },
    formCard: {
      marginBottom: ms(24), // Using react-native-size-matters for responsive margin
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      shadowColor: colors.tertiary[800],
      shadowOffset: { width: 0, height: ms(6) }, // Using react-native-size-matters for responsive shadow
      shadowOpacity: 0.08,
      shadowRadius: ms(12), // Using react-native-size-matters for responsive shadow
      elevation: 6,
    },
    formCardGradient: {
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      borderWidth: ms(1), // Using react-native-size-matters for responsive border
      borderColor: colors.primary[200],
    },
    formSection: {
      padding: ms(15), // Using react-native-size-matters for responsive padding
      gap: ms(20), // Using react-native-size-matters for responsive gap
    },
    sectionTitle: {
      fontSize: ms(18), // Using react-native-size-matters for responsive font size
      fontWeight: "700",
      color: colors.tertiary[700],
    },

    requirementsContainer: {
      marginTop: ms(16), // Using react-native-size-matters for responsive margin
      paddingTop: ms(16), // Using react-native-size-matters for responsive padding
      borderTopWidth: ms(1), // Using react-native-size-matters for responsive border
      borderTopColor: colors.primary[200],
    },
    requirementsTitle: {
      fontSize: ms(14), // Using react-native-size-matters for responsive font size
      fontWeight: "600",
      color: colors.tertiary[600],
      marginBottom: ms(8), // Using react-native-size-matters for responsive margin
    },
    requirementItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: ms(4),
    },
    requirementText: {
      fontSize: ms(13), // Using react-native-size-matters for responsive font size
      color: colors.tertiary[400],
      marginLeft: ms(8), // Using react-native-size-matters for responsive margin
    },
    requirementsList: {
      paddingLeft: ms(4), // Using react-native-size-matters for responsive padding
    },
    requirementMet: {
      color: colors.success[500],
      fontWeight: "500",
    },
    buttonSection: {
      marginTop: ms(8), // Using react-native-size-matters for responsive margin
      gap: ms(12), // Using react-native-size-matters for responsive gap
    },
    primaryButton: {
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      shadowColor: colors.secondary[600],
      shadowOffset: { width: 0, height: ms(6) }, // Using react-native-size-matters for responsive shadow
      shadowOpacity: 0.25,
      shadowRadius: ms(12), // Using react-native-size-matters for responsive shadow
      elevation: 8,
    },
    primaryButtonDisabled: {
      shadowOpacity: 0.1,
      elevation: 3,
    },
    primaryButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: ms(15), // Using react-native-size-matters for responsive padding
      paddingHorizontal: ms(32), // Using react-native-size-matters for responsive padding
      borderRadius: ms(20), // Using react-native-size-matters for responsive border radius
      gap: ms(12), // Using react-native-size-matters for responsive gap
    },
    primaryButtonText: {
      fontSize: ms(16), // Using react-native-size-matters for responsive font size
      fontWeight: "700",
      color: colors.primary[50],
      letterSpacing: ms(0.3), // Using react-native-size-matters for responsive letter spacing
    },
    secondaryButton: {
      borderRadius: ms(16),
      shadowColor: colors.tertiary[800],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.08,
      shadowRadius: ms(6),
      elevation: 3,
    },
    secondaryButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: ms(14),
      paddingHorizontal: ms(20),
      borderRadius: ms(16),
      gap: ms(8),
      borderWidth: ms(1),
      borderColor: colors.primary[300],
    },
    secondaryButtonIcon: {
      // Using react-native-size-matters for responsive icon sizing
    },
    secondaryButtonText: {
      fontSize: ms(14),
      fontWeight: "600",
      color: colors.tertiary[600],
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      paddingVertical: ms(16), // Using react-native-size-matters for responsive padding
      backgroundColor: colors.tertiary[50],
      borderRadius: ms(16), // Using react-native-size-matters for responsive border radius
      borderWidth: ms(1), // Using react-native-size-matters for responsive border
      borderColor: colors.primary[200],
      marginTop: ms(12), // Using react-native-size-matters for responsive margin
    },
    infoIcon: {
      marginRight: ms(12), // Using react-native-size-matters for responsive margin
      marginTop: ms(2), // Using react-native-size-matters for responsive margin
    },
    infoText: {
      fontSize: ms(13), // Using react-native-size-matters for responsive font size
      color: colors.tertiary[500],
      lineHeight: ms(20), // Using react-native-size-matters for responsive line height
      flex: 1,
      fontWeight: "500",
    },
    emailInfo: {
      fontSize: ms(13),
      color: colors.tertiary[500],
      lineHeight: ms(20),
      flex: 1,
      fontWeight: "500",
      marginTop: ms(8),
    },
  });

  return (
    <PageContainer
      headerBack={true}
      headerTitle="Changer le mot de passe"
      onCustomBack={onBack}
      bottomBar={false}
      titleLeft={true}
    >
      <KeyboardAvoidingView
        style={dynamicStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? ms(60) : 0} // Using react-native-size-matters for responsive offset
      >
        <ScrollView
          style={dynamicStyles.scrollView}
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Elegant Header Section */}
          <View style={dynamicStyles.headerSection}>
            <LinearGradient
              colors={[
                colors.tertiary[50],
                colors.primary[50],
                colors.secondary[50],
              ]}
              style={dynamicStyles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={dynamicStyles.iconWrapper}>
                <LinearGradient
                  colors={[colors.secondary[400], colors.secondary[600]]}
                  style={dynamicStyles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="shield-halved"
                    size={ms(28)} // Using react-native-size-matters for responsive icon size
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </View>
              <Text style={dynamicStyles.headerTitle}>Sécurité du compte</Text>
              <Text style={dynamicStyles.headerSubtitle}>
                Modifiez votre mot de passe pour renforcer la sécurité de votre compte
              </Text>
            </LinearGradient>
          </View>

          {/* Form Card */}
          <View style={dynamicStyles.formCard}>
            <LinearGradient
              colors={[colors.primary[50], colors.primary[50]]}
              style={dynamicStyles.formCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={dynamicStyles.formSection}>
                <Text style={dynamicStyles.sectionTitle}>Modifier le mot de passe</Text>
                
                <Input
                  name="currentPassword"
                  control={control}
                  type={InputType.PASSWORD}
                  label="Mot de passe actuel"
                  required={true}
                  placeholder="Entrez votre mot de passe actuel"
                  leftLogo={faLock}
                  rules={validationRules.currentPassword}
                />

                <Input
                  name="newPassword"
                  control={control}
                  type={InputType.PASSWORD}
                  label="Nouveau mot de passe"
                  required={true}
                  placeholder="Entrez votre nouveau mot de passe"
                  leftLogo={faShieldHalved}
                  rules={{
                    ...validationRules.newPassword,
                    validate: validateNewPasswordDifferent,
                  }}
                />

                <Input
                  name="confirmPassword"
                  control={control}
                  type={InputType.PASSWORD}
                  label="Confirmer le mot de passe"
                  required={true}
                  placeholder="Confirmez votre nouveau mot de passe"
                  leftLogo={faLock}
                  rules={{
                    ...validationRules.confirmPassword,
                    validate: validatePasswordMatch,
                  }}
                />

                {/* Password Requirements Info */}
                <View style={dynamicStyles.requirementsContainer}>
                  <Text style={dynamicStyles.requirementsTitle}>Exigences du mot de passe :</Text>
                  <View style={dynamicStyles.requirementsList}>
                    <Text style={dynamicStyles.requirementText}>
                      • Au moins 8 caractères
                    </Text>
                    <Text style={dynamicStyles.requirementText}>
                      • Différent du mot de passe actuel
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={dynamicStyles.buttonSection}>
            <TouchableOpacity
              style={[dynamicStyles.primaryButton, isLoading && dynamicStyles.primaryButtonDisabled]}
              onPress={onChangePassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isLoading
                    ? [colors.tertiary[200], colors.tertiary[300]]
                    : [colors.secondary[400], colors.secondary[600]]
                }
                style={dynamicStyles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary[50]} />
                ) : (
                  <>
                    <FontAwesome6
                      name="check"
                      size={ms(18)} // Using react-native-size-matters for responsive icon size
                      color={colors.primary[50]}
                    />
                    <Text style={dynamicStyles.primaryButtonText}>Modifier le mot de passe</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Security Info */}
            <View style={dynamicStyles.infoContainer}>
              <FontAwesome6
                name="shield-halved"
                size={ms(16)} // Using react-native-size-matters for responsive icon size
                color={colors.tertiary[400]}
                style={dynamicStyles.infoIcon}
              />
              <Text style={dynamicStyles.infoText}>
                Votre mot de passe sera immédiatement mis à jour et vous devrez vous reconnecter sur vos autres appareils
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
};

export default ForgotPasswordPresenter; 