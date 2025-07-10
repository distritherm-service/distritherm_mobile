import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './ProAccountCategoryModalStyles';

interface ProAccountCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => Promise<void>;
  isLoading?: boolean;
}

const ProAccountCategoryModal: React.FC<ProAccountCategoryModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [categoryName, setCategoryName] = useState<string>('');

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le nom de la catégorie professionnelle.');
      return;
    }

    if (categoryName.trim().length < 2) {
      Alert.alert('Erreur', 'Le nom de la catégorie doit contenir au moins 2 caractères.');
      return;
    }

    if (categoryName.trim().length > 255) {
      Alert.alert('Erreur', 'Le nom de la catégorie ne peut pas dépasser 255 caractères.');
      return;
    }

    try {
      await onSubmit(categoryName.trim());
      setCategoryName('');
      onClose();
    } catch (error) {
      // L'erreur sera gérée par le composant parent
    }
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Devenir compte professionnel</Text>
            
            <Text style={styles.subtitle}>
              Dans quelle catégorie professionnelle souhaitez-vous être référencé ?
            </Text>

            <Text style={styles.label}>Catégorie professionnelle *</Text>
            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Ex: Électricien, Plombier, Chauffagiste..."
              placeholderTextColor="#999"
              maxLength={255}
              editable={!isLoading}
              autoFocus
            />

            <Text style={styles.helperText}>
              Saisissez votre domaine d'expertise principal. Cette information aidera nos équipes à mieux comprendre votre profil professionnel.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Envoyer ma demande</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProAccountCategoryModal; 