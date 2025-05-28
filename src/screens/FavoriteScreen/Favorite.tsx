import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";

const Favorite = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Favorite</Text>
    </PageContainer>
  );
};

export default Favorite;

const styles = StyleSheet.create({});
