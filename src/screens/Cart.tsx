import { Text } from "react-native";
import React from "react";
import PageContainer from "../components/PageContainer/PageContainer";
import { ms } from "react-native-size-matters";

const Cart = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Cart</Text>
    </PageContainer>
  );
};

export default Cart;
