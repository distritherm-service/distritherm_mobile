import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";

const Search = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Search</Text>
    </PageContainer>
  );
};

export default Search;

const styles = StyleSheet.create({});
