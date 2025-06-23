import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Pressable, Modal, FlatList, NativeSyntheticEvent, TextInputFocusEventData, ViewStyle, TextStyle } from 'react-native';
import { useColors } from "src/hooks/useColors";
import { ms } from 'react-native-size-matters';
import { InputType } from "src/types/InputType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faChevronUp, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { SelectOption } from './Input';

type InputPresenterProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  type?: InputType;
  placeholder?: string;
  error?: string;
  label?: string;
  leftLogo?: IconDefinition;
  options?: SelectOption[];
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  onSelectOption?: (option: SelectOption) => void;
  selectedOption?: SelectOption;
  searchPlaceholder?: string;
  // Custom style props - these will override default styles
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  selectStyle?: ViewStyle;
};

const InputPresenter = ({
  value,
  onChangeText,
  onBlur,
  type = InputType.DEFAULT,
  placeholder,
  error,
  label,
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
}: InputPresenterProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // For searchable select
  const colors = useColors(); // Using react-native-size-matters for responsive design

  // Dynamic styles using colors from useColors hook
  const dynamicStyles = StyleSheet.create({
    label: {
      fontSize: ms(15), // Using react-native-size-matters - slightly reduced from 16 to 15
      fontWeight: "600",
      color: colors.tertiary[500],
      marginBottom: ms(3), // Using react-native-size-matters for responsive margin
      letterSpacing: 0.3,
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      paddingVertical: ms(13), // Using react-native-size-matters for responsive padding
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: ms(6), // Using react-native-size-matters for responsive border radius
      paddingHorizontal: ms(10), // Using react-native-size-matters for responsive padding
      fontSize: ms(15), // Using react-native-size-matters - slightly reduced from 16 to 15
      color: colors.tertiary[500],
      backgroundColor: colors.primary[50],
      shadowColor: colors.tertiary[500],
      flex: 1,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      overflow: "hidden",
    },
    textareaInput: {
      height: ms(60), // Using react-native-size-matters for responsive height
      paddingTop: ms(6), // Using react-native-size-matters for responsive padding
      paddingBottom: ms(6), // Using react-native-size-matters for responsive padding
    },
    inputWithLeftLogo: {
      paddingLeft: ms(33), // Using react-native-size-matters for responsive padding
    },
    inputError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
    leftLogoContainer: {
      position: "absolute",
      left: ms(12), // Using react-native-size-matters for responsive positioning
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      zIndex: 1,
    },
    errorText: {
      color: colors.error,
      fontSize: ms(12), // Using react-native-size-matters for responsive font size
      marginTop: ms(4), // Using react-native-size-matters for responsive margin
      fontWeight: "500",
    },
    selectContainer: {
      height: ms(40), // Using react-native-size-matters for responsive height
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: ms(8), // Using react-native-size-matters for responsive border radius
      paddingHorizontal: ms(12), // Using react-native-size-matters for responsive padding
      backgroundColor: colors.primary[50],
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.tertiary[500],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    selectText: {
      fontSize: ms(15), // Using react-native-size-matters - slightly reduced from 16 to 15
      color: colors.tertiary[500],
      flex: 1,
      textAlign: 'left',
    },
    placeholderText: {
      color: colors.tertiary[400],
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.primary[50],
      borderRadius: ms(12), // Using react-native-size-matters for responsive border radius
      maxHeight: ms(300), // Using react-native-size-matters for responsive height
      width: '80%',
      shadowColor: colors.tertiary[500],
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    optionItem: {
      paddingVertical: ms(16), // Using react-native-size-matters for responsive padding
      paddingHorizontal: ms(20), // Using react-native-size-matters for responsive padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedOption: {
      backgroundColor: colors.secondary[50],
    },
    optionText: {
      fontSize: ms(16), // Using react-native-size-matters - slightly reduced from 17 to 16
      color: colors.tertiary[500],
    },
    selectedOptionText: {
      color: colors.secondary[500],
      fontWeight: '600',
    },
    chevronContainer: {
      marginLeft: ms(8), // Using react-native-size-matters for responsive margin
    },
    passwordToggle: {
      position: "absolute",
      right: ms(12), // Using react-native-size-matters for responsive positioning
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      zIndex: 1,
    },
    inputWithRightIcon: {
      paddingRight: ms(32), // Using react-native-size-matters for responsive padding
    },
  });

  // Determine if we should show the password toggle
  const isPasswordField = type === InputType.PASSWORD;
  const shouldShowPassword = isPasswordField && isPasswordVisible;
  const actualSecureTextEntry = isPasswordField ? !isPasswordVisible : secureTextEntry;

  const getKeyboardType = () => {
    switch (type) {
      case InputType.EMAIL_ADDRESS:
        return 'email-address';
      case InputType.NUMERIC:
        return 'numeric';
      default:
        return 'default';
    }
  };

  // Filter options based on search query for searchable select
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
      return selectedOption ? selectedOption.label : placeholder || 'Select an option';
    }
    if (type === InputType.SEARCHABLE_SELECT) {
      return selectedOption ? selectedOption.label : placeholder || 'Select an option';
    }
    return value;
  };

  const renderSelectModal = () => (
    <Modal
      visible={isSelectOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setIsSelectOpen(false);
        setSearchQuery(''); // Clear search when closing
      }}
    >
      <Pressable 
        style={dynamicStyles.modalOverlay}
        onPress={() => {
          setIsSelectOpen(false);
          setSearchQuery(''); // Clear search when closing
        }}
      >
        <View style={dynamicStyles.modalContent}>
          {/* Search input for searchable select */}
          {type === InputType.SEARCHABLE_SELECT && (
            <View style={{
              padding: ms(16),
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <TextInput
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: colors.primary[300],
                  borderRadius: ms(8),
                  paddingHorizontal: ms(12),
                  paddingVertical: ms(10),
                  fontSize: ms(15), // Slightly reduced from 16 to 15
                  color: colors.text,
                }}
                placeholder={searchPlaceholder || "Rechercher..."}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
          )}
          <FlatList
            data={getFilteredOptions()}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  dynamicStyles.optionItem,
                  (type === InputType.SELECT && item.value === value) ||
                  (type === InputType.SEARCHABLE_SELECT && selectedOption?.value === item.value)
                    ? dynamicStyles.selectedOption : {}
                ]}
                onPress={() => {
                  if (type === InputType.SELECT) {
                  onChangeText(item.value);
                  } else if (type === InputType.SEARCHABLE_SELECT && onSelectOption) {
                    onSelectOption(item);
                  }
                  setIsSelectOpen(false);
                  setSearchQuery('');
                }}
              >
                <Text style={[
                  dynamicStyles.optionText,
                  ((type === InputType.SELECT && item.value === value) ||
                   (type === InputType.SEARCHABLE_SELECT && selectedOption?.value === item.value))
                    ? dynamicStyles.selectedOptionText : {}
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              type === InputType.SEARCHABLE_SELECT && searchQuery.trim() ? (
                <View style={{ padding: ms(20), alignItems: 'center' }}>
                  <Text style={{ color: colors.textSecondary, fontSize: ms(15) }}>
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

  if (type === InputType.SELECT || type === InputType.SEARCHABLE_SELECT) {
    return (
      <View style={containerStyle}>
        {label && <Text style={[dynamicStyles.label, labelStyle]}>{label}</Text>}
        <Pressable
          style={({ pressed }) => [
            dynamicStyles.selectContainer,
            error && dynamicStyles.inputError,
            leftLogo && dynamicStyles.inputWithLeftLogo,
            pressed && { opacity: 0.8 },
            selectStyle // Custom select style takes priority
          ]}
          onPress={() => setIsSelectOpen(true)}
        >
          {leftLogo && (
            <View style={dynamicStyles.leftLogoContainer}>
              <FontAwesomeIcon 
                icon={leftLogo} 
                size={ms(16)} // Using react-native-size-matters for responsive icon size
                color={colors.tertiary[500]} 
              />
            </View>
          )}
          <Text style={[
            dynamicStyles.selectText,
            ((type === InputType.SELECT && !value) || 
             (type === InputType.SEARCHABLE_SELECT && !selectedOption)) && dynamicStyles.placeholderText,
          ]}>
            {getSelectedLabel()}
          </Text>
          <View style={dynamicStyles.chevronContainer}>
            <FontAwesomeIcon 
              icon={isSelectOpen ? faChevronUp : faChevronDown} 
              size={ms(14)} // Using react-native-size-matters for responsive icon size
              color={colors.tertiary[500]} 
            />
          </View>
        </Pressable>
        {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
        {renderSelectModal()}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {label && <Text style={[dynamicStyles.label, labelStyle]}>{label}</Text>}
      <View style={dynamicStyles.inputContainer}>
        {leftLogo && (
          <View style={dynamicStyles.leftLogoContainer}>
            <FontAwesomeIcon 
              icon={leftLogo} 
              size={ms(16)} // Using react-native-size-matters for responsive icon size
              color={colors.tertiary[500]} 
            />
          </View>
        )}
        <TextInput
          style={[
            dynamicStyles.input,
            leftLogo && dynamicStyles.inputWithLeftLogo,
            isPasswordField && dynamicStyles.inputWithRightIcon,
            error && dynamicStyles.inputError,
            type === InputType.TEXTAREA && dynamicStyles.textareaInput,
            inputStyle // Custom input style takes priority
          ]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={actualSecureTextEntry}
          keyboardType={getKeyboardType()}
          placeholderTextColor={colors.tertiary[400]}
          multiline={type === InputType.TEXTAREA || multiline}
          numberOfLines={type === InputType.TEXTAREA ? numberOfLines : 1}
          textAlignVertical={type === InputType.TEXTAREA ? 'top' : 'center'}
          textAlign="left"
        />
        {isPasswordField && (
          <Pressable
            style={dynamicStyles.passwordToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesomeIcon 
              icon={shouldShowPassword ? faEye : faEyeSlash} 
              size={ms(16)} // Using react-native-size-matters for responsive icon size
              color={colors.tertiary[500]} 
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputPresenter;
