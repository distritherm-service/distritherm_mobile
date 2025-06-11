import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import PageContainer from "src/components/PageContainer/PageContainer";
import AuthForm from "src/components/AuthForm/AuthForm";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import { Control, FieldErrors } from "react-hook-form";
import { LoginFormData } from "src/types/AuthTypes";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import ForgotPasswordModal from "src/components/ForgotPasswordModal/ForgotPasswordModal";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";

interface LoginPresenterProps {
  control: Control<LoginFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
  validationRules: any;
  onForgotPassword: () => void;
  showForgotPasswordModal: boolean;
  onCloseForgotPasswordModal: () => void;
  onBack: () => void;
}

const LoginPresenter = ({
  control,
  onSubmit,
  isLoading,
  error,
  validationRules,
  onForgotPassword,
  showForgotPasswordModal,
  onCloseForgotPasswordModal,
  onBack,
}: LoginPresenterProps) => {
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      paddingVertical: ms(8), // Using react-native-size-matters for responsive padding
      paddingHorizontal: ms(4), // Using react-native-size-matters for responsive padding
    },
    forgotPasswordText: {
      color: colors.secondary[500],
      fontSize: ms(14), // Using react-native-size-matters for responsive font size
      fontWeight: '600',
      letterSpacing: ms(0.2), // Using react-native-size-matters for responsive letter spacing
    },
  });

  return (
    <PageContainer 
      bottomBar={false}
      headerBack={true}
      headerTitle="Connexion"
      onCustomBack={onBack}
    >
      <AuthForm 
        type="login"
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
      >
        <Input<LoginFormData>
          name="email"
          control={control}
          type={InputType.EMAIL_ADDRESS}
          placeholder="Votre adresse email"
          label="Email"
          leftLogo={faEnvelope}
          rules={validationRules.email}
        />
        
        <Input<LoginFormData>
          name="password"
          control={control}
          type={InputType.PASSWORD}
          placeholder="Votre mot de passe"
          label="Mot de passe"
          leftLogo={faLock}
          rules={validationRules.password}
        />

        <TouchableOpacity 
          style={dynamicStyles.forgotPasswordButton}
          onPress={onForgotPassword}
        >
          <Text style={dynamicStyles.forgotPasswordText}>
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>
      </AuthForm>

      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={onCloseForgotPasswordModal}
      />
    </PageContainer>
  );
};

export default LoginPresenter;
