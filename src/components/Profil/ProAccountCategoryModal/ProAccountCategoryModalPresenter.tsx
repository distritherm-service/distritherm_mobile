import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useColors } from 'src/hooks/useColors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Control, FieldErrors } from 'react-hook-form';
import Input from 'src/components/Input/Input';

interface FormData {
  categoryName: string;
}

interface ProAccountCategoryModalPresenterProps {
  visible: boolean;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  hasContent: boolean;
  isLoading: boolean;
  scaleAnim: Animated.Value;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  onClose: () => void;
  onSubmit: () => void;
  onOverlayPress: () => void;
}

const ProAccountCategoryModalPresenter: React.FC<ProAccountCategoryModalPresenterProps> = ({
  visible,
  control,
  errors,
  hasContent,
  isLoading,
  scaleAnim,
  fadeAnim,
  slideAnim,
  onClose,
  onSubmit,
  onOverlayPress,
}) => {
  const colors = useColors();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calcul responsive du width selon la taille d'écran
  const getModalWidth = () => {
    if (screenWidth < 400) {
      return '90%'; // Petits écrans (très petits smartphones)
    } else if (screenWidth < 600) {
      return '85%'; // Écrans moyens (smartphones normaux)
    } else if (screenWidth < 900) {
      return '75%'; // Tablettes et grands smartphones
    } else {
      return '60%'; // Très grands écrans (tablettes larges, desktop)
    }
  };
  
  const modalWidth = getModalWidth();

  const dynamicStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      shadowColor: colors.text,
      borderColor: colors.border,
    },
    modalContentWithInput: {
      backgroundColor: colors.surface,
      shadowColor: colors.text,
      borderColor: hasContent ? colors.secondary[400] : colors.border,
      borderWidth: hasContent ? 2 : 1,
    },
    title: {
      color: colors.text,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.secondary[400], // Utilise la couleur secondaire
    },
    submitButtonDisabled: {
      backgroundColor: colors.secondary[200],
    },
    closeButton: {
      backgroundColor: colors.background,
    },
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = isLoading || !hasContent;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable 
        style={[styles.overlay, dynamicStyles.overlay]}
        onPress={onOverlayPress}
      >
        <Animated.View 
          style={[
            styles.overlayContent,
            { opacity: fadeAnim }
          ]}
        >
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <Animated.View 
                style={[
                  styles.modalContainer,
                  { width: modalWidth },
                  {
                    transform: [
                      { scale: scaleAnim },
                      { translateY: slideAnim }
                    ],
                  },
                ]}
              >
                <Animated.View 
                  style={[
                    styles.modalContent,
                    hasContent ? dynamicStyles.modalContentWithInput : dynamicStyles.modalContent,
                  ]}
                >
                  {/* Header */}
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={[styles.closeButton, dynamicStyles.closeButton]}
                      onPress={onClose}
                      disabled={isLoading}
                    >
                      <FontAwesomeIcon 
                        icon={faTimes} 
                        size={ms(18)} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                    
                    <Text style={[styles.title, dynamicStyles.title]}>
                      Catégorie professionnelle
                    </Text>
                  </View>

                  {/* Content */}
                  <View style={styles.content}>
                    {/* Input Section with custom Input component */}
                    <View style={styles.inputSection}>
                      <Input
                        name="categoryName"
                        control={control}
                        label="Quelle est votre spécialité ?"
                        placeholder="Ex: Électricien, Plombier, Chauffagiste..."
                        rules={{
                          required: 'Veuillez saisir le nom de la catégorie professionnelle.',
                          minLength: {
                            value: 2,
                            message: 'Le nom de la catégorie doit contenir au moins 2 caractères.'
                          },
                          maxLength: {
                            value: 255,
                            message: 'Le nom de la catégorie ne peut pas dépasser 255 caractères.'
                          }
                        }}
                        autoFocus
                        editable={!isLoading}
                        containerStyle={styles.inputContainer}
                      />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.cancelButton,
                          dynamicStyles.cancelButton
                        ]}
                        onPress={onClose}
                        disabled={isLoading}
                      >
                        <Text style={[styles.cancelButtonText, dynamicStyles.cancelButtonText]}>
                          Annuler
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.button,
                          styles.submitButton,
                          isSubmitDisabled ? dynamicStyles.submitButtonDisabled : dynamicStyles.submitButton
                        ]}
                        onPress={onSubmit}
                        disabled={isSubmitDisabled}
                        activeOpacity={isSubmitDisabled ? 1 : 0.8}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color={colors.surface} />
                        ) : (
                          <Text style={styles.submitButtonText}>
                            Valider
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </Animated.View>
            </Pressable>
          </KeyboardAvoidingView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    width: '100%',
  },
  modalContainer: {
    alignSelf: 'center',
    minWidth: "90%", 
  },
  modalContent: {
    borderRadius: ms(16),
    shadowOffset: {
      width: 0,
      height: ms(8),
    },
    shadowOpacity: 0.15,
    shadowRadius: ms(12),
    elevation: 12,
    borderWidth: 1,
  },
  header: {
    paddingTop: ms(24),
    paddingBottom: ms(16),
    paddingHorizontal: ms(20),
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: ms(12),
    right: ms(12),
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: ms(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: ms(20),
    paddingBottom: ms(24),
  },
  inputSection: {
    marginBottom: ms(24),
  },
  inputContainer: {
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: ms(12),
  },
  button: {
    flex: 1,
    paddingVertical: ms(14),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ms(48),
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: ms(16),
    fontWeight: '500',
  },
  submitButton: {
    shadowOffset: {
      width: 0,
      height: ms(2),
    },
    shadowOpacity: 0.2,
    shadowRadius: ms(4),
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: ms(16),
    fontWeight: '600',
  },
});

export default ProAccountCategoryModalPresenter; 