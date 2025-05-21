import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "../components/PageContainer/PageContainer";
import { ms } from "react-native-size-matters";

const Profil = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Profil</Text>
    </PageContainer>
  );
};

export default Profil;

const styles = StyleSheet.create({});
