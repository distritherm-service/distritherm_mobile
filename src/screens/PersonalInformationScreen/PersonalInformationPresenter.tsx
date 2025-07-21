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
import {
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import PageContainer from "src/components/PageContainer/PageContainer";
import Input from "src/components/Input/Input";
import LoadingState from "src/components/LoadingState/LoadingState";
import { InputType } from "src/types/InputType";
import { useColors } from "src/hooks/useColors";
import { PersonalInformationFormData } from "./PersonalInformation";

interface PersonalInformationPresenterProps {
  control: Control<PersonalInformationFormData>;
  onSubmit: () => void;
  isLoadingUserData: boolean;
  isSubmitting: boolean;
  validationRules: {
    firstName: any;
    lastName: any;
    email: any;
    phoneNumber: any;
    companyName: any;
    siretNumber: any;
  };
  onBack: () => void;
  onReset: () => void;
  isDirty: boolean;
}

const PersonalInformationPresenter: React.FC<
  PersonalInformationPresenterProps
> = ({
  control,
  onSubmit,
  isLoadingUserData,
  isSubmitting,
  validationRules,
  onBack,
  onReset,
  isDirty,
}) => {
  const colors = useColors();

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
      marginTop: ms(10),
      textDecorationLine: "underline",
      fontWeight: "700",
      color: colors.tertiary[700],
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
    saveButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: ms(15),
      borderRadius: ms(20),
      gap: ms(12),
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingGradient: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContent: {
      alignItems: "center",
      padding: ms(20),
    },
    loadingIcon: {
      marginBottom: ms(20),
    },
    loadingText: {
      marginTop: ms(20),
      fontSize: ms(16),
      color: colors.tertiary[700],
      fontWeight: "500",
    },
    isSubmittingContainer: {
      position: "absolute",
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    isSubmittingContent: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    isSubmittingText: {
      marginTop: ms(25),
      fontSize: ms(15),
      fontWeight: "500",
      color: colors.tertiary[600],
    },
  });

  if (isLoadingUserData) {
    return (
      <PageContainer
        headerBack={true}
        headerTitle="Informations personnelles"
        onCustomBack={onBack}
        bottomBar={false}
        titleLeft={true}
      >
        <LoadingState
          message="Chargement de vos informations..."
          size="large"
        />
      </PageContainer>
    );
  }

  if (isSubmitting) {
    return (
      <PageContainer
        headerBack={true}
        headerTitle="Informations personnelles"
        onCustomBack={onBack}
        bottomBar={false}
        titleLeft={true}
      >
        <LoadingState
          message="Modification des informations en cours..."
          size="large"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      headerBack={true}
      headerTitle="Informations personnelles"
      onCustomBack={onBack}
      bottomBar={false}
      titleLeft={true}
    >
      <KeyboardAvoidingView
        style={dynamicStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? ms(60) : 0}
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
                    name="user-pen"
                    size={ms(28)}
                    color={colors.primary[50]}
                  />
                </LinearGradient>
              </View>
              <Text style={dynamicStyles.headerTitle}>Modifier mes informations</Text>
              <Text style={dynamicStyles.headerSubtitle}>
                Mettez à jour vos informations personnelles en toute sécurité
              </Text>
            </LinearGradient>
          </View>

          {/* Form Section with Card Design */}
          <View style={dynamicStyles.formCard}>
            <LinearGradient
              colors={[colors.primary[50], colors.primary[50]]}
              style={dynamicStyles.formCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={dynamicStyles.formSection}>
                <Text style={[dynamicStyles.sectionTitle, {marginTop: ms(0)}]}>Informations générales</Text>

                <Input<PersonalInformationFormData>
                  name="firstName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Votre prénom"
                  label="Prénom"
                  required={true}
                  leftLogo={faUser}
                  rules={validationRules.firstName}
                />

                <Input<PersonalInformationFormData>
                  name="lastName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Votre nom de famille"
                  label="Nom de famille"
                  required={true}
                  leftLogo={faUser}
                  rules={validationRules.lastName}
                />

                <Text style={dynamicStyles.sectionTitle}>Contact</Text>

                <Input<PersonalInformationFormData>
                  name="email"
                  control={control}
                  type={InputType.EMAIL_ADDRESS}
                  placeholder="votre.email@exemple.com"
                  label="Adresse email"
                  required={true}
                  leftLogo={faEnvelope}
                  rules={validationRules.email}
                />

                <Input<PersonalInformationFormData>
                  name="phoneNumber"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="+33 6 12 34 56 78"
                  label="Téléphone"
                  required={true}
                  leftLogo={faPhone}
                  rules={validationRules.phoneNumber}
                  keyboardType="phone-pad"
                />

                <Text style={dynamicStyles.sectionTitle}>Informations entreprise</Text>

                <Input<PersonalInformationFormData>
                  name="companyName"
                  control={control}
                  type={InputType.DEFAULT}
                  placeholder="Ex: Ma Société SARL"
                  label="Nom de l'entreprise"
                  required={false}
                  leftLogo={faBuilding}
                  rules={validationRules.companyName}
                />

                <Input<PersonalInformationFormData>
                  name="siretNumber"
                  control={control}
                  type={InputType.NUMERIC}
                  placeholder="12345678901234"
                  label="Numéro SIRET"
                  required={false}
                  leftLogo={faIdCard}
                  rules={validationRules.siretNumber}
                  keyboardType="numeric"
                />
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={dynamicStyles.buttonSection}>
            {/* Save Button */}
            <TouchableOpacity
              style={dynamicStyles.saveButton}
              onPress={onSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.secondary[400], colors.secondary[600]]}
                style={dynamicStyles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome6
                  name="floppy-disk"
                  size={ms(18)}
                  color={colors.primary[50]}
                />
                <Text style={dynamicStyles.saveButtonText}>
                  Sauvegarder les modifications
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Reset Button - Only show if form is dirty */}
            {isDirty && (
              <TouchableOpacity
                style={dynamicStyles.resetButton}
                onPress={onReset}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[colors.primary[100], colors.primary[200]]}
                  style={dynamicStyles.resetButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome6
                    name="rotate-left"
                    size={ms(16)}
                    color={colors.tertiary[600]}
                  />
                  <Text style={dynamicStyles.resetButtonText}>
                    Annuler les modifications
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Info text */}
            <View style={dynamicStyles.infoContainer}>
              <FontAwesome6
                name="info-circle"
                size={ms(14)}
                color={colors.tertiary[400]}
                style={dynamicStyles.infoIcon}
              />
              <Text style={dynamicStyles.infoText}>
                Vos informations sont protégées et ne seront pas partagées. Les
                champs marqués d'un * sont obligatoires.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
};

export default PersonalInformationPresenter;
