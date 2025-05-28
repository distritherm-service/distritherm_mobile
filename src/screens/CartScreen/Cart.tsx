import { Text } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";

const Cart = () => {
  return (
    <PageContainer>
      <Text style={{ fontSize: ms(20) }}>Cart</Text>
    </PageContainer>
  );
};

export default Cart;
