import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Pressable, Modal, FlatList, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import colors from "src/utils/colors";
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
}: InputPresenterProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

  const getSelectedLabel = () => {
    if (type === InputType.SELECT && options) {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : placeholder || 'Select an option';
    }
    return value;
  };

  const renderSelectModal = () => (
    <Modal
      visible={isSelectOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsSelectOpen(false)}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={() => setIsSelectOpen(false)}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.optionItem,
                  item.value === value && styles.selectedOption
                ]}
                onPress={() => {
                  onChangeText(item.value);
                  setIsSelectOpen(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  item.value === value && styles.selectedOptionText
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Pressable>
    </Modal>
  );

  if (type === InputType.SELECT) {
    return (
      <View>
        {label && <Text style={styles.label}>{label}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.selectContainer,
            error && styles.inputError,
            leftLogo && styles.inputWithLeftLogo,
            pressed && { opacity: 0.8 }
          ]}
          onPress={() => setIsSelectOpen(true)}
        >
          {leftLogo && (
            <View style={styles.leftLogoContainer}>
              <FontAwesomeIcon 
                icon={leftLogo} 
                size={ms(16)} 
                color={colors.tertiary[500]} 
              />
            </View>
          )}
          <Text style={[
            styles.selectText,
            !value && styles.placeholderText,
          ]}>
            {getSelectedLabel()}
          </Text>
          <View style={styles.chevronContainer}>
            <FontAwesomeIcon 
              icon={isSelectOpen ? faChevronUp : faChevronDown} 
              size={ms(14)} 
              color={colors.tertiary[500]} 
            />
          </View>
        </Pressable>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {renderSelectModal()}
      </View>
    );
  }

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftLogo && (
          <View style={styles.leftLogoContainer}>
            <FontAwesomeIcon 
              icon={leftLogo} 
              size={ms(16)} 
              color={colors.tertiary[500]} 
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            leftLogo && styles.inputWithLeftLogo,
            isPasswordField && styles.inputWithRightIcon,
            error && styles.inputError,
            type === InputType.TEXTAREA && styles.textareaInput,
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
            style={styles.passwordToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesomeIcon 
              icon={shouldShowPassword ? faEye : faEyeSlash} 
              size={ms(16)} 
              color={colors.tertiary[500]} 
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: ms(14),
    fontWeight: "600",
    color: colors.tertiary[500],
    marginBottom: ms(3),
    letterSpacing: 0.3,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    paddingVertical: ms(11),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: ms(6),
    paddingHorizontal: ms(10),
    fontSize: ms(14),
    color: colors.tertiary[500],
    backgroundColor: colors.primary[50],
    shadowColor: colors.tertiary[500],
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
    height: ms(60),
    paddingTop: ms(6),
    paddingBottom: ms(6),
  },
  inputWithLeftLogo: {
    paddingLeft: ms(33),
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  leftLogoContainer: {
    position: "absolute",
    left: ms(12),
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: ms(12),
    marginTop: ms(4),
    fontWeight: "500",
  },
  selectContainer: {
    height: ms(40),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
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
    fontSize: ms(14),
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
    borderRadius: ms(12),
    maxHeight: ms(300),
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
    paddingVertical: ms(16),
    paddingHorizontal: ms(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.secondary[50],
  },
  optionText: {
    fontSize: ms(16),
    color: colors.tertiary[500],
  },
  selectedOptionText: {
    color: colors.secondary[500],
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: ms(8),
  },
  passwordToggle: {
    position: "absolute",
    right: ms(12),
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  inputWithRightIcon: {
    paddingRight: ms(32),
  },
});

export default InputPresenter;
