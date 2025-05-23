import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { colors } from "src/utils/colors";
import { ms } from "react-native-size-matters";
import { InputType } from "src/types/InputType";
import { Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface InputPresenterProps {
  placeholder?: string;
  value: string;
  onChangeText: any;
  label?: string;
  secureTextEntry?: boolean;
  type?: InputType;
  leftLogo?: IconDefinition;
}

const InputPresenter: React.FC<InputPresenterProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  type = InputType.DEFAULT,
  leftLogo,
}) => {
  return (
    <View style={styles.container}>
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
            type === InputType.TEXTAREA && styles.textarea,
            leftLogo && styles.inputWithLeftLogo,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry || type === InputType.PASSWORD}
          keyboardType={
            type === InputType.PASSWORD || type === InputType.TEXTAREA
              ? "default"
              : type
          }
          placeholderTextColor={colors.tertiary[500]}
          multiline={type === InputType.TEXTAREA}
          numberOfLines={type === InputType.TEXTAREA ? 4 : 1}
        />
      </View>
    </View>
  );
};

export default InputPresenter;

const styles = StyleSheet.create({
  container: {
    marginBottom: ms(20),
  },
  label: {
    fontSize: ms(14),
    fontWeight: "500",
    color: colors.secondary[500],
    marginBottom: ms(10),
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: ms(50),
    borderWidth: 1,
    borderColor: colors.tertiary[100],
    borderRadius: ms(12),
    paddingHorizontal: ms(18),
    fontSize: ms(15),
    color: colors.tertiary[600],
    backgroundColor: colors.tertiary[50],
    shadowColor: colors.tertiary[50],
    shadowOffset: { width: ms(0), height: ms(2) },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  inputWithLeftLogo: {
    paddingLeft: ms(50),
  },
  leftLogoContainer: {
    position: "absolute",
    left: ms(15),
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  textarea: {
    height: ms(100),
    textAlignVertical: "top",
    paddingTop: ms(14),
  },
  searchIcon: {
    position: "absolute",
    right: ms(15),
    top: ms(13),
  },
  searchIconText: {
    fontSize: ms(18),
  },
});
