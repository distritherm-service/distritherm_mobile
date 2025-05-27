import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "../PageContainer/PageContainer";
import Header from "./Header/Header";
import PromotionsBanner from "./PromotionsBanner/PromotionsBanner";
import Recommandation from "./Recommandation/Recommandations";
import CategoryList from "./CategoryList/CategoryList";

interface HomePresenterProps {
  isLoading: boolean;
  error: string | null;
}

const HomePresenter: React.FC<HomePresenterProps> = ({ isLoading, error }) => {
  return (
    <PageContainer>
      <Header />
      <View style={styles.categorySection}>
        <CategoryList />
      </View>
      <PromotionsBanner />
      <Recommandation />
    </PageContainer>
  );
};

export default HomePresenter;

const styles = StyleSheet.create({
  categorySection: {
    minHeight: 120, // Ensure minimum height for CategoryList
    marginVertical: 10,
  },
});
