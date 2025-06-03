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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={moderateScale(20)} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
          </Text>

          <View style={styles.inputContainer}>
            <Input<ForgotPasswordFormData>
              name="email"
              control={control}
              type={InputType.EMAIL_ADDRESS}
              placeholder="Votre adresse email"
              label="Email"
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20), // Using scale for responsive padding
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12), // Using moderateScale for responsive border radius
    padding: scale(20),
    width: '100%',
    maxWidth: scale(400),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(2), // Using verticalScale for responsive shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
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
    color: '#333',
  },
  closeButton: {
    padding: scale(5), // Using scale for responsive padding
  },
  description: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(20),
    lineHeight: moderateScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10), // Using scale for responsive gap
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(44),
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default ForgotPasswordModalPresenter; 