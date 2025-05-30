import { StyleSheet } from "react-native";
import React from "react";
import PageContainer from "src/components/PageContainer/PageContainer";
import AuthForm from "src/components/AuthForm/AuthForm";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";
import { Control, FieldErrors } from "react-hook-form";
import { LoginFormData } from "src/types/AuthTypes";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

interface LoginPresenterProps {
  control: Control<LoginFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
  validationRules: any;
}

const LoginPresenter = ({
  control,
  onSubmit,
  isLoading,
  error,
  validationRules,
}: LoginPresenterProps) => {
  return (
    <PageContainer bottomBar={false}>
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
      </AuthForm>
    </PageContainer>
  );
};

export default LoginPresenter;

const styles = StyleSheet.create({});
