import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "../components/PageContainer/PageContainer";
import { ms } from "react-native-size-matters";

const Favorite = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Favorite</Text>
    </PageContainer>
  );
};

export default Favorite;

const styles = StyleSheet.create({});
