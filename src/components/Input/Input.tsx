import React from "react";
import { TextInputProps } from "react-native";
import InputPresenter from "./InputPresenter";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { InputType } from "src/types/InputType";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  type?: InputType;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  leftLogo?: IconDefinition;
} & TextInputProps;

const Input = ({
  value,
  onChangeText,
  type = InputType.DEFAULT,
  placeholder,
  label,
  secureTextEntry,
  leftLogo,
  ...props
}: InputProps) => {
  return (
    <InputPresenter
      value={value}
      onChangeText={onChangeText}
      type={type}
      placeholder={placeholder}
      label={label}
      leftLogo={leftLogo}
      {...props}
    />
  );
};

export default Input;
