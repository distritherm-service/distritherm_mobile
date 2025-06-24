import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useColors } from 'src/hooks/useColors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface AuthRequiredModalPresenterProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onGoToLogin: () => void;
}

const AuthRequiredModalPresenter: React.FC<AuthRequiredModalPresenterProps> = ({
  visible,
  title,
  message,
  onClose,
  onGoToLogin,
}) => {
  const colors = useColors();

  // Dynamic styles using colors from useColors hook and react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Keep this as is for overlay transparency
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: ms(24),
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.tertiary[100],
      width: '100%',
      maxWidth: ms(360),
      borderRadius: ms(24),
      paddingHorizontal: ms(12),
      paddingBottom: ms(24),
      elevation: 20,
      shadowColor: '#000', // Keep this as is for shadow effect
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      borderWidth: 1,
    },
    header: {
      alignItems: 'flex-end',
      paddingTop: ms(16),
      marginBottom: ms(8),
    },
    closeButton: {
      backgroundColor: colors.tertiary[50],
      width: ms(36),
      height: ms(36),
      borderRadius: ms(18),
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      backgroundColor: colors.background,
      borderColor: colors.tertiary[200],
      width: ms(80),
      height: ms(80),
      borderRadius: ms(40),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: ms(20),
      borderWidth: 1,
    },
    title: {
      color: colors.text,
      fontSize: ms(22),
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: ms(12),
      lineHeight: ms(28),
    },
    message: {
      color: colors.tertiary[600],
      fontSize: ms(16),
      fontWeight: '400',
      textAlign: 'center',
      lineHeight: ms(22),
      marginBottom: ms(32),
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: ms(12),
    },
    secondaryButton: {
      backgroundColor: colors.tertiary[50],
      borderColor: colors.tertiary[200],
      flex: 1,
      paddingVertical: ms(12),
      paddingHorizontal: ms(20),
      borderRadius: ms(12),
      alignItems: 'center',
      borderWidth: 1,
    },
    secondaryButtonText: {
      color: colors.tertiary[700],
      fontSize: ms(14),
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: colors.secondary[500],
      flex: 1,
      paddingVertical: ms(12),
      paddingHorizontal: ms(20),
      borderRadius: ms(12),
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000', // Keep this as is for shadow effect
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    primaryButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: ms(14),
      fontWeight: '600',
    },
    buttonIcon: {
      marginLeft: ms(6),
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={dynamicStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={dynamicStyles.modalContainer}>
              {/* Header with close button */}
              <View style={dynamicStyles.header}>
                <TouchableOpacity
                  style={dynamicStyles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={ms(20)}
                    color={colors.tertiary[600]}
                  />
                </TouchableOpacity>
              </View>

              {/* Icon container */}
              <View style={dynamicStyles.iconContainer}>
                <FontAwesomeIcon
                  icon={faLock}
                  size={ms(32)}
                  color={colors.tertiary[500]}
                />
              </View>

              {/* Title */}
              <Text style={dynamicStyles.title}>
                {title}
              </Text>

              {/* Message */}
              <Text style={dynamicStyles.message}>
                {message}
              </Text>

              {/* Action buttons */}
              <View style={dynamicStyles.buttonContainer}>
                <TouchableOpacity
                  style={dynamicStyles.secondaryButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={dynamicStyles.secondaryButtonText}>
                    Annuler
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={dynamicStyles.primaryButton}
                  onPress={onGoToLogin}
                  activeOpacity={0.8}
                >
                  <View style={dynamicStyles.primaryButtonContent}>
                    <Text style={dynamicStyles.primaryButtonText}>
                      Se connecter
                    </Text>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      size={ms(14)}
                      color={colors.background}
                      style={dynamicStyles.buttonIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AuthRequiredModalPresenter; 