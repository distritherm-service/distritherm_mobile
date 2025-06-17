import React from "react";
import { TextInputProps } from "react-native";
import InputPresenter from "./InputPresenter";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { InputType } from "src/types/InputType";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
  id?: number; // For API compatibility
}

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  value?: string;
  onChangeText?: (text: string) => void;
  type?: InputType;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  leftLogo?: IconDefinition;
  error?: string;
  options?: SelectOption[]; // For select type
  multiline?: boolean; // For textarea type
  numberOfLines?: number; // For textarea type
  rules?: object; // Validation rules for react-hook-form
  // New props for searchable select
  onSelectOption?: (option: SelectOption) => void; // Callback when option is selected
  selectedOption?: SelectOption; // Currently selected option for searchable select
  searchPlaceholder?: string; // Placeholder for search input
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

const Input = <T extends FieldValues>({
  name,
  control,
  value,
  onChangeText,
  type = InputType.DEFAULT,
  placeholder,
  label,
  secureTextEntry,
  leftLogo,
  error,
  options,
  multiline,
  numberOfLines,
  rules,
  onSelectOption,
  selectedOption,
  searchPlaceholder,
  ...props
}: InputProps<T>) => {
  // If control is provided, use Controller from react-hook-form
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value: fieldValue }, fieldState: { error: fieldError } }) => (
          <InputPresenter
            value={fieldValue || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            type={type}
            placeholder={placeholder}
            label={label}
            leftLogo={leftLogo}
            error={fieldError?.message || error}
            options={options}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry || type === InputType.PASSWORD}
            onSelectOption={onSelectOption}
            selectedOption={selectedOption}
            searchPlaceholder={searchPlaceholder}
            {...props}
          />
        )}
      />
    );
  }

  // Fallback for direct usage without react-hook-form
  return (
    <InputPresenter
      value={value || ""}
      onChangeText={onChangeText || (() => {})}
      type={type}
      placeholder={placeholder}
      label={label}
      leftLogo={leftLogo}
      error={error}
      options={options}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry || type === InputType.PASSWORD}
      onSelectOption={onSelectOption}
      selectedOption={selectedOption}
      searchPlaceholder={searchPlaceholder}
      {...props}
    />
  );
};

export default Input;
