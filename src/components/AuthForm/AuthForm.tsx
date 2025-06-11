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
  const navigation = useNavigation<any>();
  const [contentHeight, setContentHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [errorGoogleSignIn, setErrorGoogleSignIn] = useState<string>("");

  // Calculate if content is scrollable (content height > available screen height)
  const isScrollable = contentHeight > screenHeight;

  const onPressRedirection = () => {
    if (type === "login") {
      navigation.navigate("Register");
    } else {
      navigation.navigate("Login");
    }
  };

  const onGoogleSignInError = (errorText: string) => {
    setErrorGoogleSignIn(errorText);
  };

  const handleContentSizeChange = (height: number) => {
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
      onPressRedirection={onPressRedirection}
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
