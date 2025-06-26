import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ms, s, vs } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { DevisFilter } from "./DevisFilters";

interface DevisFiltersPresenterProps {
  filterOptions: { key: DevisFilter; label: string }[];
  activeFilter: DevisFilter;
  onFilterPress: (filter: DevisFilter) => void;
}

const DevisFiltersPresenter: React.FC<DevisFiltersPresenterProps> = ({
  filterOptions,
  activeFilter,
  onFilterPress,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    container: {
      paddingHorizontal: s(20),
      marginBottom: vs(20),
    },
    scrollContainer: {
      flexDirection: "row" as const,
    },
    filterButton: {
      paddingHorizontal: s(18),
      paddingVertical: vs(10),
      borderRadius: ms(25), // More rounded for modern look
      marginRight: s(12),
      borderWidth: 2,
    },
    filterButtonActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    filterButtonInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.tertiary[900],
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    filterButtonText: {
      fontSize: ms(14),
      fontWeight: "700" as const,
      textAlign: "center" as const,
    },
    filterButtonTextActive: {
      color: colors.background,
    },
    filterButtonTextInactive: {
      color: colors.textSecondary,
    },
  };

  const renderFilterItem = ({ item }: { item: { key: DevisFilter; label: string } }) => {
    const isActive = activeFilter === item.key;
    
    return (
      <TouchableOpacity
        style={[
          dynamicStyles.filterButton,
          isActive
            ? dynamicStyles.filterButtonActive
            : dynamicStyles.filterButtonInactive,
        ]}
        onPress={() => onFilterPress(item.key)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            dynamicStyles.filterButtonText,
            isActive
              ? dynamicStyles.filterButtonTextActive
              : dynamicStyles.filterButtonTextInactive,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filterOptions}
        keyExtractor={(item) => item.key}
        renderItem={renderFilterItem}
        contentContainerStyle={dynamicStyles.scrollContainer}
      />
    </View>
  );
};

export default DevisFiltersPresenter; 