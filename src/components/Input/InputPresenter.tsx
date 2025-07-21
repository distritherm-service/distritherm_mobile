import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useColors } from 'src/hooks/useColors';
import { ms } from 'react-native-size-matters';
import { InputType } from 'src/types/InputType';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SelectOption } from './Input';

type InputPresenterProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  type?: InputType;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  leftLogo?: IconDefinition;
  options?: SelectOption[];
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  onSelectOption?: (option: SelectOption) => void;
  selectedOption?: SelectOption;
  searchPlaceholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  selectStyle?: ViewStyle;
};

const InputPresenter: React.FC<InputPresenterProps> = ({
  value,
  onChangeText,
  onBlur,
  type = InputType.DEFAULT,
  placeholder,
  error,
  label,
  required = false,
  leftLogo,
  options,
  multiline,
  numberOfLines = 4,
  secureTextEntry,
  onSelectOption,
  selectedOption,
  searchPlaceholder,
  containerStyle,
  inputStyle,
  labelStyle,
  selectStyle,
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useColors();

  // Determine input behavior
  const isPasswordField = type === InputType.PASSWORD;
  const isSelectField = type === InputType.SELECT || type === InputType.SEARCHABLE_SELECT;
  const isTextareaField = type === InputType.TEXTAREA || multiline;
  const hasLeftIcon = !!leftLogo;
  const hasRightIcon = isPasswordField;

  // Create dynamic styles
  const styles = StyleSheet.create({
    // Main container
    container: {
      marginBottom: ms(4), // Using react-native-size-matters
    },

    // Label styles
    label: {
      fontSize: ms(15), // Using react-native-size-matters
      fontWeight: '600',
      color: colors.tertiary[500],
      marginBottom: ms(6), // Using react-native-size-matters
      letterSpacing: 0.3,
    },

    // Base input container
    inputWrapper: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },

         // Base input styles
     baseInput: {
       flex: 1,
       borderWidth: 1,
       borderColor: colors.border,
       borderRadius: ms(8), // Using react-native-size-matters
       backgroundColor: colors.primary[50],
       fontSize: ms(15), // Using react-native-size-matters
       color: colors.tertiary[500],
       paddingHorizontal: ms(14), // Using react-native-size-matters
       minHeight: ms(46), // Using react-native-size-matters - reduced from 50 to 46
       shadowColor: colors.tertiary[500],
       shadowOffset: { width: 0, height: 1 },
       shadowOpacity: 0.05,
       shadowRadius: 2,
       elevation: 1,
     },

         // Input variations
     inputWithLeftIcon: {
       paddingLeft: ms(40), // Using react-native-size-matters - reduced from 50 to 45
     },

     inputWithRightIcon: {
       paddingRight: ms(45), // Using react-native-size-matters - reduced from 50 to 45
     },

         textareaInput: {
       minHeight: ms(90), // Using react-native-size-matters - reduced from 100 to 90
       paddingTop: ms(12), // Using react-native-size-matters - reduced from 15 to 12
       textAlignVertical: 'top',
     },

    // Error state
    inputError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },

         // Icon containers
     leftIconContainer: {
       position: 'absolute',
       left: ms(12), // Using react-native-size-matters - reduced from 15 to 12
       top: 0,
       bottom: 0,
       justifyContent: 'center',
       alignItems: 'center',
       zIndex: 1,
       width: ms(20), // Using react-native-size-matters
     },

     leftIconContainerTextarea: {
       position: 'absolute',
       left: ms(12),
       top: ms(12), // Position fixe en haut pour les textarea
       justifyContent: 'flex-start',
       alignItems: 'center',
       zIndex: 1,
       width: ms(20),
     },

     rightIconContainer: {
       position: 'absolute',
       right: ms(12), // Using react-native-size-matters - reduced from 15 to 12
       top: 0,
       bottom: 0,
       justifyContent: 'center',
       alignItems: 'center',
       zIndex: 1,
       width: ms(20), // Using react-native-size-matters
     },

         // Select styles
     selectContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       borderWidth: 1,
       borderColor: colors.border,
       borderRadius: ms(8), // Using react-native-size-matters
       backgroundColor: colors.primary[50],
       paddingHorizontal: ms(14), // Using react-native-size-matters
       paddingVertical: ms(12), // Using react-native-size-matters - reduced from 15 to 12
       minHeight: ms(46), // Using react-native-size-matters - reduced from 50 to 46
       shadowColor: colors.tertiary[500],
       shadowOffset: { width: 0, height: 1 },
       shadowOpacity: 0.05,
       shadowRadius: 2,
       elevation: 1,
     },

    selectText: {
      flex: 1,
      fontSize: ms(16), // Using react-native-size-matters
      color: colors.tertiary[500],
    },

    selectPlaceholder: {
      color: colors.tertiary[400],
    },

    chevronContainer: {
      marginLeft: ms(10), // Using react-native-size-matters
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContent: {
      backgroundColor: colors.primary[50],
      borderRadius: ms(12), // Using react-native-size-matters
      maxHeight: ms(400), // Using react-native-size-matters
      width: '85%',
      maxWidth: ms(300), // Using react-native-size-matters
      shadowColor: colors.tertiary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },

    searchInputContainer: {
      padding: ms(16), // Using react-native-size-matters
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    modalSearchInput: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: colors.primary[300],
      borderRadius: ms(8), // Using react-native-size-matters
      paddingHorizontal: ms(12), // Using react-native-size-matters
      paddingVertical: ms(10), // Using react-native-size-matters
      fontSize: ms(15), // Using react-native-size-matters
      color: colors.tertiary[500],
    },

    optionItem: {
      paddingVertical: ms(16), // Using react-native-size-matters
      paddingHorizontal: ms(20), // Using react-native-size-matters
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    selectedOptionItem: {
      backgroundColor: colors.secondary[50],
    },

    optionText: {
      fontSize: ms(16), // Using react-native-size-matters
      color: colors.tertiary[500],
    },

    selectedOptionText: {
      color: colors.secondary[500],
      fontWeight: '600',
    },

    emptyState: {
      padding: ms(20), // Using react-native-size-matters
      alignItems: 'center',
    },

    emptyStateText: {
      color: colors.tertiary[400],
      fontSize: ms(15), // Using react-native-size-matters
    },

    // Error text
    errorText: {
      color: colors.error,
      fontSize: ms(13), // Using react-native-size-matters
      marginTop: ms(6), // Using react-native-size-matters
      fontWeight: '500',
    },
  });

  // Helper functions
  const getKeyboardType = () => {
    switch (type) {
      case InputType.EMAIL_ADDRESS:
        return 'email-address';
      case InputType.NUMERIC:
      case InputType.DATE:
        return 'numeric';
      default:
        return 'default';
    }
  };

  // Format date input for JJ/MM/AAAA format
  const formatDateInput = (text: string): string => {
    // Remove all non-numeric characters
    const numericOnly = text.replace(/\D/g, '');
    
    // Apply formatting based on length
    if (numericOnly.length <= 2) {
      return numericOnly;
    } else if (numericOnly.length <= 4) {
      return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2)}`;
    } else if (numericOnly.length <= 8) {
      return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2, 4)}/${numericOnly.slice(4, 8)}`;
    } else {
      // Limit to 8 digits max (DDMMYYYY)
      return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2, 4)}/${numericOnly.slice(4, 8)}`;
    }
  };

  // Handle text change with date formatting
  const handleTextChange = (text: string) => {
    if (type === InputType.DATE) {
      const formattedText = formatDateInput(text);
      onChangeText(formattedText);
    } else {
      onChangeText(text);
    }
  };

  const getFilteredOptions = () => {
    if (!options) return [];
    if (type !== InputType.SEARCHABLE_SELECT || !searchQuery.trim()) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getSelectedLabel = () => {
    if (type === InputType.SELECT && options) {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : placeholder || 'Sélectionnez une option';
    }
    if (type === InputType.SEARCHABLE_SELECT) {
      return selectedOption ? selectedOption.label : placeholder || 'Sélectionnez une option';
    }
    return value;
  };

  const handleSelectOption = (option: SelectOption) => {
    if (type === InputType.SELECT) {
      onChangeText(option.value);
    } else if (type === InputType.SEARCHABLE_SELECT && onSelectOption) {
      onSelectOption(option);
    }
    setIsSelectOpen(false);
    setSearchQuery('');
  };

  const closeModal = () => {
    setIsSelectOpen(false);
    setSearchQuery('');
  };

  // Render functions
  const renderLeftIcon = () => {
    if (!hasLeftIcon) return null;
    
    return (
      <View style={isTextareaField ? styles.leftIconContainerTextarea : styles.leftIconContainer}>
        <FontAwesomeIcon
          icon={leftLogo!}
          size={ms(18)} // Using react-native-size-matters
          color={colors.tertiary[500]}
        />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (!hasRightIcon) return null;

    return (
      <Pressable
        style={styles.rightIconContainer}
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <FontAwesomeIcon
          icon={isPasswordVisible ? faEye : faEyeSlash}
          size={ms(18)} // Using react-native-size-matters
          color={colors.tertiary[500]}
        />
      </Pressable>
    );
  };

  const renderSelectModal = () => (
    <Modal
      visible={isSelectOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalOverlay} onPress={closeModal}>
        <View style={styles.modalContent}>
          {type === InputType.SEARCHABLE_SELECT && (
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder={searchPlaceholder || 'Rechercher...'}
                placeholderTextColor={colors.tertiary[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
          )}
          <FlatList
            data={getFilteredOptions()}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = 
                (type === InputType.SELECT && item.value === value) ||
                (type === InputType.SEARCHABLE_SELECT && selectedOption?.value === item.value);

              return (
                <Pressable
                  style={[
                    styles.optionItem,
                    isSelected && styles.selectedOptionItem,
                  ]}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              type === InputType.SEARCHABLE_SELECT && searchQuery.trim() ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Aucun résultat trouvé
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </Pressable>
    </Modal>
  );

  const renderTextInput = () => {
    const inputStyles = [
      styles.baseInput,
      hasLeftIcon && styles.inputWithLeftIcon,
      hasRightIcon && styles.inputWithRightIcon,
      isTextareaField && styles.textareaInput,
      error && styles.inputError,
      inputStyle, // Custom styles override
    ];

    return (
      <View style={styles.inputWrapper}>
        {renderLeftIcon()}
        <TextInput
          style={inputStyles}
          value={value}
          onChangeText={handleTextChange}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.tertiary[400]}
          secureTextEntry={isPasswordField ? !isPasswordVisible : secureTextEntry}
          keyboardType={getKeyboardType()}
          multiline={isTextareaField}
          numberOfLines={isTextareaField ? numberOfLines : 1}
          textAlignVertical={isTextareaField ? 'top' : 'center'}
          maxLength={type === InputType.DATE ? 10 : undefined}
        />
        {renderRightIcon()}
      </View>
    );
  };

  const renderSelect = () => {
    const displayText = getSelectedLabel();
    const isPlaceholder = displayText === placeholder || 
      (type === InputType.SELECT && !value) ||
      (type === InputType.SEARCHABLE_SELECT && !selectedOption);

    return (
      <>
        <Pressable
          style={[
            styles.selectContainer,
            hasLeftIcon && styles.inputWithLeftIcon,
            error && styles.inputError,
            selectStyle, // Custom styles override
          ]}
          onPress={() => setIsSelectOpen(true)}
        >
          {renderLeftIcon()}
          <Text
            style={[
              styles.selectText,
              isPlaceholder && styles.selectPlaceholder,
            ]}
          >
            {displayText}
          </Text>
          <View style={styles.chevronContainer}>
            <FontAwesomeIcon
              icon={isSelectOpen ? faChevronUp : faChevronDown}
              size={ms(16)} // Using react-native-size-matters
              color={colors.tertiary[500]}
            />
          </View>
        </Pressable>
        {renderSelectModal()}
      </>
    );
  };

  // Main render
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}{required && <Text style={{ color: '#EF4444' }}> *</Text>}
        </Text>
      )}
      
      {isSelectField ? renderSelect() : renderTextInput()}
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputPresenter; 