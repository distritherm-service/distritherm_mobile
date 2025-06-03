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
import { Control, FieldErrors } from "react-hook-form";
import { faUser, faEnvelope, faPhone, faBuilding, faIdCard } from "@fortawesome/free-solid-svg-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import colors from "src/utils/colors";
import { PersonalInformationFormData } from "./PersonalInformation";

interface PersonalInformationPresenterProps {
  control: Control<PersonalInformationFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  errors: FieldErrors<PersonalInformationFormData>;
  validationRules: any;
  watchedValues: PersonalInformationFormData;
  onBack: () => void;
  onReset: () => void;
  isDirty: boolean;
}

const PersonalInformationPresenter: React.FC<PersonalInformationPresenterProps> = ({
  control,
  onSubmit,
  isLoading,
  errors,
  validationRules,
  watchedValues,
  onBack,
  onReset,
  isDirty,
}) => {
  return (
    <PageContainer
      headerBack={true}
      headerTitle="Informations personnelles"
      onCustomBack={onBack}
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
                    name="user-pen"
                    size={ms(28)}
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </View>
              <Text style={styles.headerTitle}>Modifier mes informations</Text>
              <Text style={styles.headerSubtitle}>
                Mettez à jour vos informations personnelles en toute sécurité
              </Text>
            </LinearGradient>
          </View>

          {/* Form Section with Card Design */}
          <View style={styles.formCard}>
            <LinearGradient
              colors={[colors.primary[50], colors.primary[50]]}
              style={styles.formCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Informations générales</Text>
                
                <Input<PersonalInformationFormData>
                  name="firstName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Votre prénom"
                  label="Prénom *"
                  leftLogo={faUser}
                  rules={validationRules.firstName}
                />
                
                <Input<PersonalInformationFormData>
                  name="lastName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Votre nom de famille"
                  label="Nom de famille *"
                  leftLogo={faUser}
                  rules={validationRules.lastName}
                />
                
                <Text style={styles.sectionTitle}>Contact</Text>
                
                <Input<PersonalInformationFormData>
                  name="email"
                  control={control}
                  type={InputType.EMAIL_ADDRESS}
                  placeholder="votre.email@exemple.com"
                  label="Adresse email *"
                  leftLogo={faEnvelope}
                  rules={validationRules.email}
                />
                
                <Input<PersonalInformationFormData>
                  name="phoneNumber"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="+33 6 12 34 56 78"
                  label="Téléphone"
                  leftLogo={faPhone}
                  rules={validationRules.phoneNumber}
                  keyboardType="phone-pad"
                />

                <Text style={styles.sectionTitle}>Informations entreprise</Text>
                
                <Input<PersonalInformationFormData>
                  name="companyName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Nom de votre entreprise"
                  label="Nom de l'entreprise *"
                  leftLogo={faBuilding}
                  rules={validationRules.companyName}
                />
                
                <Input<PersonalInformationFormData>
                  name="siretNumber"
                  control={control}
                  type={InputType.NUMERIC}
                  placeholder="12345678901234"
                  label="Numéro SIRET *"
                  leftLogo={faIdCard}
                  rules={validationRules.siretNumber}
                  keyboardType="numeric"
                />
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={onSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isLoading
                    ? [colors.tertiary[200], colors.tertiary[300]]
                    : [colors.secondary[400], colors.secondary[600]]
                }
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.primary[50]} />
                ) : (
                  <>
                    <FontAwesome6
                      name="floppy-disk"
                      size={ms(18)}
                      color={colors.primary[50]}
                    />
                    <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Reset Button - Only show if form is dirty */}
            {isDirty && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={onReset}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[colors.primary[100], colors.primary[200]]}
                  style={styles.resetButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="rotate-left"
                    size={ms(16)}
                    color={colors.tertiary[600]}
                    style={styles.resetButtonIcon}
                  />
                  <Text style={styles.resetButtonText}>Annuler les modifications</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            {/* Info text */}
            <View style={styles.infoContainer}>
              <FontAwesome6
                name="info-circle"
                size={ms(14)}
                color={colors.tertiary[400]}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Vos informations sont protégées et ne seront pas partagées. Les champs marqués d'un * sont obligatoires.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
};

export default PersonalInformationPresenter;

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
    marginBottom: ms(8),
    paddingLeft: ms(4),
  },
  buttonSection: {
    marginTop: ms(8),
    gap: ms(12),
  },
  saveButton: {
    borderRadius: ms(20),
    shadowColor: colors.secondary[600],
    shadowOffset: { width: 0, height: ms(6) },
    shadowOpacity: 0.25,
    shadowRadius: ms(12),
    elevation: 8,
  },
  saveButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 3,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(18),
    paddingHorizontal: ms(32),
    borderRadius: ms(20),
    gap: ms(12),
    minHeight: ms(56),
  },
  saveButtonText: {
    fontSize: ms(16),
    fontWeight: "700",
    color: colors.primary[50],
    letterSpacing: ms(0.3),
  },
  resetButton: {
    borderRadius: ms(16),
    shadowColor: colors.tertiary[800],
    shadowOffset: { width: 0, height: ms(2) },
    shadowOpacity: 0.08,
    shadowRadius: ms(6),
    elevation: 3,
  },
  resetButtonGradient: {
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
  resetButtonIcon: {
    // Using react-native-size-matters for responsive icon sizing
  },
  resetButtonText: {
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
    marginTop: ms(8),
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
}); 