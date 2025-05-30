import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "src/components/PageContainer/PageContainer";
import AuthForm from "src/components/AuthForm/AuthForm";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";

const LoginPresenter = () => {
  return (
    <PageContainer bottomBar={false}>
      <AuthForm type="login">
        <Input
          value=""
          onChangeText={() => {}}
          type={InputType.DEFAULT}
        />
      </AuthForm>
    </PageContainer>
  );
};

export default LoginPresenter;

const styles = StyleSheet.create({});
