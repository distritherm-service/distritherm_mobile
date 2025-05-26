import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "../PageContainer/PageContainer";
import Header from "./Header/Header";
import PromotionsBanner from "./PromotionsBanner/PromotionsBanner";

const HomePresenter = () => {
  return (
    <PageContainer>
      <Header />
      <PromotionsBanner />
    </PageContainer>
  );
};

export default HomePresenter;

const styles = StyleSheet.create({});
