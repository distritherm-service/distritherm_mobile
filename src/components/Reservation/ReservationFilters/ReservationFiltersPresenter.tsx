import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { ReservationFilter } from "src/types/Reservation";

interface ReservationFiltersPresenterProps {
  filterOptions: { key: ReservationFilter; label: string }[];
  activeFilter: ReservationFilter;
  onFilterPress: (filter: ReservationFilter) => void;
}

const ReservationFiltersPresenter: React.FC<ReservationFiltersPresenterProps> = ({
  filterOptions,
  activeFilter,
  onFilterPress,
}) => {
  const colors = useColors();

  const dynamicStyles = {
    container: {
      paddingHorizontal: ms(20),
      marginVertical: ms(20),
    },
    scrollContainer: {
      flexDirection: "row" as const,
    },
    filterButton: {
      paddingHorizontal: ms(18),
      paddingVertical: ms(10),
      borderRadius: ms(25),
      marginRight: ms(12),
      borderWidth: 2,
    },
    filterButtonActive: {
      backgroundColor: colors.secondary[500],
      borderColor: colors.secondary[500],
      shadowColor: colors.secondary[500],
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

  const renderFilterItem = ({ item }: { item: { key: ReservationFilter; label: string } }) => {
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

export default ReservationFiltersPresenter; 