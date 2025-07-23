import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Control } from 'react-hook-form';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'; // Using react-native-size-matters for responsive design
import Input from '../Input/Input';
import { InputType } from '../../types/InputType';
import { faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useColors } from 'src/hooks/useColors';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordModalPresenterProps {
  visible: boolean;
  onClose: () => void;
  control: Control<ForgotPasswordFormData>;
  onSubmit: () => void;
  isLoading: boolean;
}

const ForgotPasswordModalPresenter: React.FC<ForgotPasswordModalPresenterProps> = ({
  visible,
  onClose,
  control,
  onSubmit,
  isLoading,
}) => {
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20), // Using scale for responsive padding
    },
    modalContainer: {
      backgroundColor: colors.primary[50],
      borderRadius: moderateScale(12), // Using moderateScale for responsive border radius
      padding: scale(20), // Using scale for responsive padding
      width: '100%',
      maxWidth: scale(400), // Using scale for responsive max width
      shadowColor: colors.tertiary[900],
      shadowOffset: {
        width: 0,
        height: verticalScale(2), // Using verticalScale for responsive shadow
      },
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(3.84), // Using moderateScale for responsive shadow
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(15), // Using verticalScale for responsive vertical spacing
    },
    title: {
      fontSize: moderateScale(20), // Using moderateScale for responsive font size
      fontWeight: 'bold',
      color: colors.tertiary[500],
    },
    closeButton: {
      padding: scale(5), // Using scale for responsive padding
    },
    description: {
      fontSize: moderateScale(14), // Using moderateScale for responsive font size
      color: colors.textSecondary,
      marginBottom: verticalScale(20), // Using verticalScale for responsive margin
      lineHeight: moderateScale(20), // Using moderateScale for responsive line height
    },
    inputContainer: {
      marginBottom: verticalScale(20), // Using verticalScale for responsive margin
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(10), // Using scale for responsive gap
    },
    button: {
      flex: 1,
      paddingVertical: verticalScale(12), // Using verticalScale for responsive padding
      borderRadius: moderateScale(8), // Using moderateScale for responsive border radius
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(44), // Using verticalScale for responsive height
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: moderateScale(16), // Using moderateScale for responsive font size
      fontWeight: '500',
    },
    submitButton: {
      backgroundColor: colors.secondary[400],
    },
    submitButtonText: {
      color: colors.primary[50],
      fontSize: moderateScale(16), // Using moderateScale for responsive font size
      fontWeight: '600',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.overlay}>
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.header}>
            <Text style={dynamicStyles.title}>Mot de passe oublié</Text>
            <TouchableOpacity onPress={onClose} style={dynamicStyles.closeButton}>
              <FontAwesomeIcon 
                icon={faTimes} 
                size={moderateScale(20)} // Using moderateScale for responsive icon size
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          <Text style={dynamicStyles.description}>
            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
          </Text>

          <View style={dynamicStyles.inputContainer}>
            <Input<ForgotPasswordFormData>
              name="email"
              control={control}
              type={InputType.EMAIL_ADDRESS}
              placeholder="Votre adresse email"
              label="Email"
              required={true}
              leftLogo={faEnvelope}
              rules={{
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format d\'email invalide',
                },
              }}
            />
          </View>

          <View style={dynamicStyles.buttonContainer}>
            <TouchableOpacity
              style={[dynamicStyles.button, dynamicStyles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={dynamicStyles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[dynamicStyles.button, dynamicStyles.submitButton]}
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primary[50]} size="small" />
              ) : (
                <Text style={dynamicStyles.submitButtonText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModalPresenter; 