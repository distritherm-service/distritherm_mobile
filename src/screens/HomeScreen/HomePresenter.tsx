import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "src/components/PageContainer/PageContainer";
import CategoryList from "src/components/Home/CategoryList/CategoryList";
import PromotionsBanner from "src/components/Home/PromotionsBanner/PromotionsBanner";
import Recommandation from "src/components/Home/Recommandation/Recommandations";
import Header from "src/components/Home/Header/Header";
import SearchBar from "src/components/Home/SearchBar/SearchBar";

interface HomePresenterProps {
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const HomePresenter: React.FC<HomePresenterProps> = ({ 
  isLoading, 
  error, 
  searchQuery, 
  onSearch 
}) => {
  return (
    <PageContainer isScrollable={true}>
      <Header />
      <SearchBar 
        onSearch={onSearch}
        placeholder="Rechercher des produits..."
      />
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
