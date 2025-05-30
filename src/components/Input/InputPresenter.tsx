import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import colors from "src/utils/colors";
import { scale, verticalScale } from 'react-native-size-matters';
import { InputType } from "src/types/InputType";
import { Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type InputPresenterProps = {
  value: string;
  onChangeText: (text: string) => void;
  type?: InputType;
  placeholder?: string;
  error?: string;
  label?: string;
  leftLogo?: IconDefinition;
};

const InputPresenter = ({
  value,
  onChangeText,
  type = InputType.DEFAULT,
  placeholder,
  error,
  label,
  leftLogo,
}: InputPresenterProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftLogo && (
          <View style={styles.leftLogoContainer}>
            <FontAwesomeIcon 
              icon={leftLogo} 
              size={scale(16)} 
              color={colors.tertiary[500]} 
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            leftLogo && styles.inputWithLeftLogo,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={type === 'password'}
          keyboardType={type === InputType.EMAIL_ADDRESS ? 'email-address' : 'default'}
          placeholderTextColor={colors.tertiary[500]}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: scale(14),
    fontWeight: "500",
    color: colors.secondary[500],
    marginBottom: verticalScale(10),
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    fontSize: scale(14),
    color: colors.text,
  },
  inputWithLeftLogo: {
    paddingLeft: scale(50),
  },
  leftLogoContainer: {
    position: "absolute",
    left: scale(15),
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: scale(12),
    marginTop: verticalScale(4),
  },
});

export default InputPresenter;
