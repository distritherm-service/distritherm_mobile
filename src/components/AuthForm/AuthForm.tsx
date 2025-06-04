import { View, Text } from "react-native";
import React, { ReactNode, useState } from "react";
import AuthFormPresenter from "./AuthFormPresenter";
import { useNavigation } from "@react-navigation/native";

interface AuthFormProps {
  error?: string;
  children?: ReactNode;
  type: "login" | "register";
  onSubmit?: () => void;
  isLoading?: boolean;
}

const AuthForm = ({
  error,
  children,
  type,
  onSubmit,
  isLoading = false,
}: AuthFormProps) => {
  const navigation = useNavigation<any>(); // Using any to handle both Auth and Main navigation
  const [contentHeight, setContentHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [errorGoogleSignIn, setErrorGoogleSignIn] = useState<string>("");

  // Calculate if content is scrollable (content height > available screen height)
  const isScrollable = contentHeight > screenHeight;

  const onPressLoginRedirection = () => {
    if (type === "login") {
      // Going from Login to Register - slide from right
      navigation.navigate("Register");
    } else {
      // Going from Register to Login - slide from left (handled by screen options)
      navigation.navigate("Login");
    }
  };

  const onGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Main",
          params: { initialTab: "Profil" },
        },
      ],
    });
  };

  const onGoogleSignInError = (errorText: string) => {
    setErrorGoogleSignIn(errorText);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleScrollContainerLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScreenHeight(height);
  };

  return (
    <AuthFormPresenter
      error={error}
      type={type}
      onPressLoginRedirection={onPressLoginRedirection}
      onGoBack={onGoBack}
      onSubmit={onSubmit}
      isLoading={isLoading}
      isScrollable={isScrollable}
      onContentSizeChange={handleContentSizeChange}
      onScrollContainerLayout={handleScrollContainerLayout}
      errorGoogleSignIn={errorGoogleSignIn}
      onGoogleSignInError={onGoogleSignInError}
    >
      {children}
    </AuthFormPresenter>
  );
};

export default AuthForm;
