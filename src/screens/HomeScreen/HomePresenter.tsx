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
import { SearchParams } from "src/navigation/types";

interface HomePresenterProps {
  onSearchBarPress: () => void;
  onNavigateToSearch?: (params: SearchParams) => void;
  onNavigateToCategories?: () => void;
}

const HomePresenter: React.FC<HomePresenterProps> = ({ 
  onSearchBarPress,
  onNavigateToSearch,
  onNavigateToCategories
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
        onPress={onSearchBarPress}
        placeholder="Rechercher des produits..."
        editable={false} // Make it non-editable so it acts as a button
      />
      <View style={dynamicStyles.categorySection}>
        <CategoryList 
          onNavigateToSearch={onNavigateToSearch} 
          onViewAll={onNavigateToCategories}
        />
      </View>
      <PromotionsBanner />
      <Recommandation />
    </PageContainer>
  );
};

export default HomePresenter;
