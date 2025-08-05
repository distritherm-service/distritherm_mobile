import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import CategoryList from "src/components/Home/CategoryList/CategoryList";
import PromotionsBanner from "src/components/Home/PromotionsBanner/PromotionsBanner";
import Recommandation from "src/components/Home/Recommandation/Recommandations";
import Header from "src/components/Home/Header/Header";
import SearchBar from "src/components/Home/SearchBar/SearchBar";
import { useColors } from "src/hooks/useColors";
import { useScrollDown } from "src/hooks/useScrollDown";
import { SearchParams } from "src/navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { isScrollingDown, onScroll } = useScrollDown({ threshold: 10 });
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + ms(50) : ms(40);
  
  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: statusBarHeight, // Espace pour le header sticky
    },
    categorySection: {
      minHeight: ms(120), // Using react-native-size-matters for responsive height
      marginBottom: ms(10), // Using react-native-size-matters for responsive margin
      backgroundColor: colors.background,
    },
    searchBarContainer: {
      paddingHorizontal: ms(16),
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header sticky */}
      <Header isScrollingDown={isScrollingDown} />
      
      {/* Contenu scrollable */}
      <ScrollView
        style={dynamicStyles.scrollContainer}
        contentContainerStyle={dynamicStyles.contentContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.searchBarContainer}>
          <SearchBar 
            onPress={onSearchBarPress}
            placeholder="Rechercher des produits..."
            editable={false} // Make it non-editable so it acts as a button
          />
        </View>
        
        <View style={dynamicStyles.categorySection}>
          <CategoryList 
            onNavigateToSearch={onNavigateToSearch} 
            onViewAll={onNavigateToCategories}
          />
        </View>
        
        <PromotionsBanner />
        <Recommandation />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePresenter;
