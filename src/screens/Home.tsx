import { Text } from "react-native";
import React from "react";
import PageContainer from "../components/PageContainer/PageContainer";
import { ms } from "react-native-size-matters";

const Home = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Home</Text>
    </PageContainer>
  );
};

export default Home;
