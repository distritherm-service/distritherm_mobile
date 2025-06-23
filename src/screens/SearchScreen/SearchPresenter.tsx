import { StyleSheet, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import OnTypingSection from "src/components/Search/OnTypingSection/OnTypingSection";
import OnSearchSection from "src/components/Search/OnSearchSection/OnSearchSection";
import PageContainer from "src/components/PageContainer/PageContainer";
import { SearchFilter } from "src/navigation/types";

interface SearchPresenterProps {
  status: "onTyping" | "onSearch";
  filter: SearchFilter;
  searchQuery: string;
  isReturningFromSearch: boolean;
  onStatusChange: (status: "onTyping" | "onSearch") => void;
  onFilterChange: (filter: SearchFilter) => void;  
  onSearch: (query: string) => void;
  onBackToTyping: () => void;
}

/**
 * Presenter component for Search
 * Clean rendering without animations to prevent weird page transitions
 */
const SearchPresenter: React.FC<SearchPresenterProps> = ({
  status,
  filter,
  searchQuery,
  isReturningFromSearch,
  onStatusChange,
  onFilterChange,
  onSearch,
  onBackToTyping,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      position: "relative",
    },
    backgroundOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: ms(200),
      backgroundColor: colors.primary[50],
      opacity: 0.1,
    },
  });

  return (
    <PageContainer isScrollable={false} bottomBar={true} headerBack={false}>
      {/* Subtle background overlay for visual depth */}
      <View style={dynamicStyles.backgroundOverlay} />

      <View style={dynamicStyles.contentContainer}>
        {status === "onTyping" ? (
          <OnTypingSection
            searchQuery={searchQuery}
            autoFocus={true}
            isReturningFromSearch={isReturningFromSearch}
            onSearch={onSearch}
          />
        ) : (
          <OnSearchSection
            searchQuery={searchQuery}
            filter={filter}
            onBackToTyping={onBackToTyping}
            onFilterChange={onFilterChange}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default SearchPresenter;
