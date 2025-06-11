import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import PageContainer from "src/components/PageContainer/PageContainer";
import CategoryList from "src/components/Home/CategoryList/CategoryList";
import PromotionsBanner from "src/components/Home/PromotionsBanner/PromotionsBanner";
import Recommandation from "src/components/Home/Recommandation/Recommandations";
import Header from "src/components/Home/Header/Header";
import SearchBar from "src/components/Home/SearchBar/SearchBar";
import { useColors } from "src/hooks/useColors";

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
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    categorySection: {
      minHeight: ms(120), // Using react-native-size-matters for responsive height
      marginVertical: ms(10), // Using react-native-size-matters for responsive margin
      backgroundColor: colors.background,
    },
  });

  return (
    <PageContainer isScrollable={true}>
      <Header />
      <SearchBar 
        onSearch={onSearch}
        placeholder="Rechercher des produits..."
      />
      <View style={dynamicStyles.categorySection}>
        <CategoryList />
      </View>
      <PromotionsBanner />
      <Recommandation />
    </PageContainer>
  );
};

export default HomePresenter;
