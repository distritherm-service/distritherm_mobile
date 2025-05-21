import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "../components/PageContainer/PageContainer";
import { ms } from "react-native-size-matters";

const Search = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Search</Text>
    </PageContainer>
  );
};

export default Search;

const styles = StyleSheet.create({});
