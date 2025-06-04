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
import colors from "src/utils/colors";
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
  return (
    <PageContainer
      headerBack={true}
      headerTitle="Changer le mot de passe"
      onCustomBack={onBack}
      bottomBar={false}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? ms(60) : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Elegant Header Section */}
          <View style={styles.headerSection}>
            <LinearGradient
              colors={[
                colors.tertiary[50],
                colors.primary[50],
                colors.secondary[50],
              ]}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconWrapper}>
                <LinearGradient
                  colors={[colors.secondary[400], colors.secondary[600]]}
                  style={styles.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="shield-halved"
                    size={ms(28)}
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </View>
              <Text style={styles.headerTitle}>Sécurité du compte</Text>
              <Text style={styles.headerSubtitle}>
                Modifiez votre mot de passe pour renforcer la sécurité de votre compte
              </Text>
            </LinearGradient>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <LinearGradient
              colors={[colors.primary[50], colors.primary[50]]}
              style={styles.formCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Modifier le mot de passe</Text>
                
                <Input
                  name="currentPassword"
                  control={control}
                  type={InputType.PASSWORD}
                  label="Mot de passe actuel"
                  placeholder="Entrez votre mot de passe actuel"
                  leftLogo={faLock}
                  rules={validationRules.currentPassword}
                />

                <Input
                  name="newPassword"
                  control={control}
                  type={InputType.PASSWORD}
                  label="Nouveau mot de passe"
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
                  placeholder="Confirmez votre nouveau mot de passe"
                  leftLogo={faLock}
                  rules={{
                    ...validationRules.confirmPassword,
                    validate: validatePasswordMatch,
                  }}
                />

                {/* Password Requirements Info */}
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Exigences du mot de passe :</Text>
                  <View style={styles.requirementsList}>
                    <Text style={styles.requirementText}>
                      • Au moins 8 caractères
                    </Text>
                    <Text style={styles.requirementText}>
                      • Différent du mot de passe actuel
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
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
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary[50]} />
                ) : (
                  <>
                    <FontAwesome6
                      name="check"
                      size={ms(18)}
                      color={colors.primary[50]}
                    />
                    <Text style={styles.primaryButtonText}>Modifier le mot de passe</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Security Info */}
            <View style={styles.infoContainer}>
              <FontAwesome6
                name="shield-halved"
                size={ms(16)}
                color={colors.tertiary[400]}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: ms(20),
    paddingBottom: ms(40),
  },
  headerSection: {
    marginBottom: ms(24),
  },
  headerGradient: {
    padding: ms(28),
    borderRadius: ms(24),
    alignItems: "center",
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(8) },
    shadowOpacity: 0.12,
    shadowRadius: ms(16),
    elevation: 8,
    borderWidth: ms(1),
    borderColor: colors.primary[200],
  },
  iconWrapper: {
    marginBottom: ms(16),
    shadowColor: colors.secondary[600],
    shadowOffset: { width: 0, height: ms(4) },
    shadowOpacity: 0.3,
    shadowRadius: ms(8),
    elevation: 6,
  },
  iconGradient: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: ms(2),
    borderColor: colors.primary[50],
  },
  headerTitle: {
    fontSize: ms(24),
    fontWeight: "800",
    color: colors.tertiary[800],
    marginBottom: ms(8),
    textAlign: "center",
    letterSpacing: ms(0.5),
  },
  headerSubtitle: {
    fontSize: ms(15),
    color: colors.tertiary[600],
    textAlign: "center",
    lineHeight: ms(22),
    paddingHorizontal: ms(10),
  },
  formCard: {
    marginBottom: ms(24),
    borderRadius: ms(20),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(6) },
    shadowOpacity: 0.08,
    shadowRadius: ms(12),
    elevation: 6,
  },
  formCardGradient: {
    borderRadius: ms(20),
    borderWidth: ms(1),
    borderColor: colors.primary[200],
  },
  formSection: {
    padding: ms(24),
    gap: ms(20),
  },
  sectionTitle: {
    fontSize: ms(18),
    fontWeight: "700",
    color: colors.tertiary[700],
  },
  inputContainer: {
    marginBottom: ms(16),
  },
  inputLabel: {
    fontSize: ms(16),
    fontWeight: "600",
    color: colors.tertiary[700],
    marginBottom: ms(10),
    paddingLeft: ms(4),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    borderRadius: ms(16),
    borderWidth: ms(2),
    borderColor: colors.primary[300],
    minHeight: ms(56),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.04,
    shadowRadius: ms(8),
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: "#FEF2F2",
    shadowColor: colors.error,
  },
  iconContainer: {
    width: ms(50),
    alignItems: "center",
    justifyContent: "center",
  },
  inputIcon: {
    // Using react-native-size-matters for responsive icon sizing
  },
  textInput: {
    flex: 1,
    fontSize: ms(16),
    color: colors.tertiary[800],
    paddingVertical: ms(16),
    paddingRight: ms(16),
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ms(6),
    paddingLeft: ms(4),
  },
  errorIcon: {
    marginRight: ms(6),
  },
  errorText: {
    fontSize: ms(13),
    color: colors.error,
    fontWeight: "500",
    flex: 1,
  },
  requirementsContainer: {
    marginTop: ms(16),
    paddingTop: ms(16),
    borderTopWidth: ms(1),
    borderTopColor: colors.primary[200],
  },
  requirementsTitle: {
    fontSize: ms(14),
    fontWeight: "600",
    color: colors.tertiary[600],
    marginBottom: ms(8),
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ms(4),
  },
  requirementText: {
    fontSize: ms(13),
    color: colors.tertiary[400],
    marginLeft: ms(8),
  },
  requirementsList: {
    paddingLeft: ms(4),
  },
  requirementMet: {
    color: colors.success,
    fontWeight: "500",
  },
  buttonSection: {
    marginTop: ms(8),
    gap: ms(12),
  },
  primaryButton: {
    borderRadius: ms(20),
    shadowColor: colors.secondary[600],
    shadowOffset: { width: 0, height: ms(6) },
    shadowOpacity: 0.25,
    shadowRadius: ms(12),
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
    paddingVertical: ms(18),
    paddingHorizontal: ms(32),
    borderRadius: ms(20),
    gap: ms(12),
    minHeight: ms(56),
  },
  primaryButtonText: {
    fontSize: ms(16),
    fontWeight: "700",
    color: colors.primary[50],
    letterSpacing: ms(0.3),
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
    paddingHorizontal: ms(20),
    paddingVertical: ms(16),
    backgroundColor: colors.tertiary[50],
    borderRadius: ms(16),
    borderWidth: ms(1),
    borderColor: colors.primary[200],
    marginTop: ms(12),
  },
  infoIcon: {
    marginRight: ms(12),
    marginTop: ms(2),
  },
  infoText: {
    fontSize: ms(13),
    color: colors.tertiary[500],
    lineHeight: ms(20),
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