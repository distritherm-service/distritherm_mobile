import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PageContainer from 'src/components/PageContainer/PageContainer'
import AuthForm from 'src/components/AuthForm/AuthForm'
import { StatusBar } from 'expo-status-bar'
import { colors } from 'src/utils/colors'

const RegisterPresenter = () => {
  return (
    <PageContainer bottomBar={false}>
      <AuthForm type="register">
        <Text>RegisterPresenter</Text>
      </AuthForm>
    </PageContainer>
  )
}

export default RegisterPresenter

const styles = StyleSheet.create({})