import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import PageContainer from "src/components/PageContainer/PageContainer";
import { useColors } from "src/hooks/useColors";

interface SearchPresenterProps {
  status: "onTyping" | "onSearch";
  filter: {
    categoryId?: number;
    categoryName?: string;
    [key: string]: any;
  };
  onStatusChange: (status: "onTyping" | "onSearch") => void;
  onFilterChange: (filter: any) => void;
}

const SearchPresenter: React.FC<SearchPresenterProps> = ({
  status,
  filter,
  onStatusChange,
  onFilterChange,
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: ms(24),
      fontWeight: "bold",
      color: colors.text,
      marginBottom: ms(20),
    },
    statusContainer: {
      backgroundColor: colors.surface,
      padding: ms(16),
      borderRadius: ms(12),
      marginBottom: ms(16),
    },
    statusText: {
      fontSize: ms(16),
      color: colors.text,
      marginBottom: ms(8),
    },
    statusValue: {
      fontSize: ms(14),
      color: colors.primary[600],
      fontWeight: "600",
    },
    filterContainer: {
      backgroundColor: colors.surface,
      padding: ms(16),
      borderRadius: ms(12),
    },
    filterTitle: {
      fontSize: ms(16),
      color: colors.text,
      fontWeight: "600",
      marginBottom: ms(12),
    },
    filterItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: ms(8),
    },
    filterLabel: {
      fontSize: ms(14),
      color: colors.textSecondary,
    },
    filterValue: {
      fontSize: ms(14),
      color: colors.text,
      fontWeight: "500",
    },
  });

  return (
    <PageContainer>
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.title}>Recherche</Text>

        <View style={dynamicStyles.statusContainer}>
          <Text style={dynamicStyles.statusText}>Statut:</Text>
          <Text style={dynamicStyles.statusValue}>{status}</Text>
        </View>

        <View style={dynamicStyles.filterContainer}>
          <Text style={dynamicStyles.filterTitle}>Filtres appliqués</Text>

          {filter.categoryName && (
            <View style={dynamicStyles.filterItem}>
              <Text style={dynamicStyles.filterLabel}>Catégorie:</Text>
              <Text style={dynamicStyles.filterValue}>
                {filter.categoryName}
              </Text>
            </View>
          )}

          {filter.categoryId && (
            <View style={dynamicStyles.filterItem}>
              <Text style={dynamicStyles.filterLabel}>ID Catégorie:</Text>
              <Text style={dynamicStyles.filterValue}>{filter.categoryId}</Text>
            </View>
          )}

          {Object.keys(filter).length === 0 && (
            <Text style={dynamicStyles.filterLabel}>Aucun filtre appliqué</Text>
          )}
        </View>
      </View>
    </PageContainer>
  );
};

export default SearchPresenter;

const styles = StyleSheet.create({});
