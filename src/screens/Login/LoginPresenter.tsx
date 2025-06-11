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
import colors from "src/utils/colors";

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
          style={styles.forgotPasswordButton}
          onPress={onForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>
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

const styles = StyleSheet.create({
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    paddingVertical: ms(8),
    paddingHorizontal: ms(4),
  },
  forgotPasswordText: {
    color: colors.secondary[500],
    fontSize: ms(14),
    fontWeight: '600',
    letterSpacing: ms(0.2),
  },
});
