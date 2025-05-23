import { StyleSheet, TextInput, View, Text } from "react-native";
import React from "react";
import InputPresenter from "./InputPresenter";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { InputType } from "src/types/InputType";

interface InputProps {
  // Basic props
  placeholder?: string;
  value: string;
  onChangeText: any;
  label?: string;
  secureTextEntry?: boolean;
  type: InputType;
  leftLogo?: IconDefinition;
}

const Input = ({
  placeholder,
  value,
  onChangeText,
  label,
  secureTextEntry,
  type,
  leftLogo,
}: InputProps) => {
  return (
    <InputPresenter
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      label={label}
      secureTextEntry={secureTextEntry}
      type={type}
      leftLogo={leftLogo}
    />
  );
};

export default Input;
