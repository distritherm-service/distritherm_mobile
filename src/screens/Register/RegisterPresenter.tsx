import { StyleSheet } from 'react-native'
import React from 'react'
import PageContainer from 'src/components/PageContainer/PageContainer'
import AuthForm from 'src/components/AuthForm/AuthForm'
import Input from 'src/components/Input/Input'
import { InputType } from 'src/types/InputType'
import { Control, FieldErrors } from 'react-hook-form'
import { RegisterFormData } from 'src/types/AuthTypes'
import { faUser, faEnvelope, faLock, faPhone, faBuilding, faIdCard } from '@fortawesome/free-solid-svg-icons'

interface RegisterPresenterProps {
  control: Control<RegisterFormData>;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
  validationRules: any;
  formErrors: FieldErrors<RegisterFormData>;
  watchedValues: RegisterFormData;
  onBack: () => void;
}

const RegisterPresenter = ({
  control,
  onSubmit,
  isLoading,
  error,
  validationRules,
  formErrors,
  watchedValues,
  onBack,
}: RegisterPresenterProps) => {
  return (
    <PageContainer 
      bottomBar={false}
      headerBack={true}
      headerTitle="Inscription"
      onCustomBack={onBack}
    >
      <AuthForm 
        type="register"
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
      >
        <Input<RegisterFormData>
          name="firstName"
          control={control}
          type={InputType.DEFAULT}
          placeholder="Votre prénom"
          label="Prénom"
          required={true}
          leftLogo={faUser}
          rules={validationRules.firstName}
        />
        
        <Input<RegisterFormData>
          name="lastName"
          control={control}
          type={InputType.DEFAULT}
          placeholder="Votre nom de famille"
          label="Nom de famille"
          required={true}
          leftLogo={faUser}
          rules={validationRules.lastName}
        />
        
        <Input<RegisterFormData>
          name="email"
          control={control}
          type={InputType.EMAIL_ADDRESS}
          placeholder="Votre adresse email"
          label="Email"
          required={true}
          leftLogo={faEnvelope}
          rules={validationRules.email}
        />
        
        <Input<RegisterFormData>
          name="password"
          control={control}
          type={InputType.PASSWORD}
          placeholder="Votre mot de passe"
          label="Mot de passe"
          required={true}
          leftLogo={faLock}
          rules={validationRules.password}
        />
        
        <Input<RegisterFormData>
          name="confirmPassword"
          control={control}
          type={InputType.PASSWORD}
          placeholder="Confirmez votre mot de passe"
          label="Confirmer le mot de passe"
          required={true}
          leftLogo={faLock}
          rules={validationRules.confirmPassword}
        />
        
        <Input<RegisterFormData>
          name="phoneNumber"
          control={control}
          type={InputType.NUMERIC}
          placeholder="Votre numéro de téléphone"
          label="Numéro de téléphone"
          required={true}
          leftLogo={faPhone}
          rules={validationRules.phoneNumber}
        />
        
        <Input<RegisterFormData>
          name="companyName"
          control={control}
          type={InputType.DEFAULT}
          placeholder="Ex: Ma Société SARL"
          label="Nom de l'entreprise"
          required={false}
          leftLogo={faBuilding}
          rules={validationRules.companyName}
        />
        
        <Input<RegisterFormData>
          name="siretNumber"
          control={control}
          type={InputType.NUMERIC}
          placeholder="12345678901234"
          label="Numéro SIRET"
          required={false}
          leftLogo={faIdCard}
          rules={validationRules.siretNumber}
        />
      </AuthForm>
    </PageContainer>
  )
}

export default RegisterPresenter

const styles = StyleSheet.create({})