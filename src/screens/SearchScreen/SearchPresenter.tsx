import { StyleSheet, View, Animated, Platform } from "react-native";
import React, { useEffect, useRef } from "react";
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
 * Handles visual rendering with modern, elegant UI and smooth transitions
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Simplified transition animation - reduced complexity for better Android performance
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Simpler animation for Android
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Full animation for iOS
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: status === "onSearch" ? -20 : 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        slideAnim.setValue(status === "onSearch" ? 20 : -20);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [status]);

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      position: "relative",
    },
    animatedContent: {
      flex: 1,
    },
    backgroundOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: ms(200),
      backgroundColor: colors.primary[50],
      opacity: Platform.OS === 'android' ? 0.1 : 0.3, // Reduced opacity on Android
    },
  });

  return (
    <PageContainer isScrollable={false} bottomBar={true} headerBack={false}>
      {/* Subtle background overlay for visual depth */}
      <View style={dynamicStyles.backgroundOverlay} />

      <View style={dynamicStyles.contentContainer}>
        <Animated.View
          style={[
            dynamicStyles.animatedContent,
            {
              opacity: fadeAnim,
              transform: Platform.OS === 'android' ? [] : [{ translateY: slideAnim }], // Disable slide animation on Android
            },
          ]}
        >
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
        </Animated.View>
      </View>
    </PageContainer>
  );
};

export default SearchPresenter;
