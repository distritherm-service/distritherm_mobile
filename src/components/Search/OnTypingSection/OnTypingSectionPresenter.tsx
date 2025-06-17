import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { useColors } from "src/hooks/useColors";
import { FontAwesome6 } from "@expo/vector-icons";
import PageContainer from "src/components/PageContainer/PageContainer";

interface SearchHistoryItem {
  id?: number;
  value: string;
  userId?: number;
  createdAt?: string;
}

interface OnTypingSectionPresenterProps {
  currentSearchQuery: string;
  searchHistory: SearchHistoryItem[];
  isLoadingHistory: boolean;
  historyError: string | null;
  autoFocus?: boolean;
  isReturningFromSearch?: boolean;
  isFocused: boolean;
  searchInputRef: React.RefObject<TextInput | null>;
  onSearchQueryChange: (query: string) => void;
  onClearSearch: () => void;
  onSubmitEditing: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onHistoryItemPress: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (item: SearchHistoryItem) => void;
  onRefreshHistory: () => void;
  formatTimeAgo: (dateString?: string) => string;
}

/**
 * Presenter component for OnTypingSection
 * Clean, modern UI optimized for Android performance
 */
const OnTypingSectionPresenter: React.FC<OnTypingSectionPresenterProps> = ({
  currentSearchQuery,
  searchHistory,
  isLoadingHistory,
  historyError,
  isFocused,
  searchInputRef,
  onSearchQueryChange,
  onClearSearch,
  onSubmitEditing,
  onFocus,
  onBlur,
  onHistoryItemPress,
  onClearHistory,
  onRemoveHistoryItem,
  onRefreshHistory,
  formatTimeAgo,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerSection: {
      paddingTop: ms(20),
      paddingBottom: ms(10),
      paddingHorizontal: ms(24),
    },
    welcomeText: {
      fontSize: ms(28),
      fontWeight: "700",
      color: colors.text,
      marginBottom: ms(8),
      letterSpacing: -0.5,
    },
    subtitleText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      fontWeight: "400",
      lineHeight: ms(22),
    },
    searchSection: {
      paddingHorizontal: ms(24),
      paddingVertical: ms(16),
    },
    searchInputWrapper: {
      position: "relative",
      marginBottom: ms(8),
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: ms(12),
      paddingHorizontal: ms(14),
      paddingVertical: ms(12),
      borderWidth: 1.5,
      borderColor: colors.primary[100],
    },
    searchInputContainerFocused: {
      borderColor: colors.primary[400],
      backgroundColor: colors.surface,
    },
    searchIcon: {
      marginRight: ms(10),
    },
    searchInput: {
      flex: 1,
      fontSize: ms(14),
      color: colors.text,
      fontWeight: "500",
      paddingVertical: ms(1),
    },
    clearButton: {
      padding: ms(6),
      marginLeft: ms(6),
      borderRadius: ms(16),
      backgroundColor: colors.primary[100],
    },

    searchHint: {
      fontSize: ms(13),
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: ms(8),
      textAlign: "center",
    },
    historySection: {
      flex: 1,
      paddingHorizontal: ms(24),
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: ms(20),
      paddingBottom: ms(12),
      borderBottomWidth: 1,
      borderBottomColor: colors.primary[100],
    },
    historyTitle: {
      fontSize: ms(18),
      fontWeight: "600",
      color: colors.text,
      letterSpacing: -0.3,
    },
    clearAllButton: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      backgroundColor: colors.error[50],
      borderRadius: ms(20),
      borderWidth: 1,
      borderColor: colors.error[200],
    },
    clearAllText: {
      fontSize: ms(13),
      color: colors.error[600],
      fontWeight: "600",
    },
    historyList: {
      flex: 1,
    },
    historyItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: ms(16),
      paddingHorizontal: ms(20),
      backgroundColor: colors.surface,
      borderRadius: ms(14),
      marginBottom: ms(12),
      borderWidth: 1,
      borderColor: colors.primary[200],
    },
    historyItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    historyItemIcon: {
      marginRight: ms(16),
      backgroundColor: colors.primary[100],
      padding: ms(8),
      borderRadius: ms(20),
    },
    historyItemText: {
      fontSize: ms(14),
      color: colors.text,
      flex: 1,
      fontWeight: "500",
    },
    historyItemTime: {
      fontSize: ms(11),
      color: colors.textSecondary,
      marginTop: ms(2),
    },
    removeButton: {
      padding: ms(10),
      marginLeft: ms(12),
      borderRadius: ms(20),
      backgroundColor: colors.error[50],
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: ms(60),
      paddingHorizontal: ms(40),
    },
    emptyStateIcon: {
      backgroundColor: colors.primary[100],
      padding: ms(20),
      borderRadius: ms(30),
      marginBottom: ms(20),
    },
    emptyStateText: {
      fontSize: ms(16),
      color: colors.text,
      textAlign: "center",
      fontWeight: "600",
      marginBottom: ms(8),
    },
    emptyStateSubtext: {
      fontSize: ms(14),
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: ms(20),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: ms(60),
    },
    loadingText: {
      fontSize: ms(16),
      color: colors.textSecondary,
      marginTop: ms(16),
      fontWeight: "500",
    },
    errorContainer: {
      backgroundColor: colors.error[50],
      padding: ms(20),
      borderRadius: ms(16),
      marginBottom: ms(20),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: colors.error[200],
    },
    errorText: {
      fontSize: ms(14),
      color: colors.error[700],
      flex: 1,
      fontWeight: "500",
    },
    retryButton: {
      paddingHorizontal: ms(16),
      paddingVertical: ms(8),
      backgroundColor: colors.error[100],
      borderRadius: ms(20),
      marginLeft: ms(16),
      borderWidth: 1,
      borderColor: colors.error[300],
    },
    retryText: {
      fontSize: ms(13),
      color: colors.error[700],
      fontWeight: "600",
    },
  });

  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: SearchHistoryItem;
    index: number;
  }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          dynamicStyles.historyItem,
          pressed && { backgroundColor: colors.primary[100] }
        ]}
        onPress={() => onHistoryItemPress(item)}
      >
        <View style={dynamicStyles.historyItemLeft}>
          <View style={dynamicStyles.historyItemIcon}>
            <FontAwesome6
              name="clock-rotate-left"
              size={ms(14)}
              color={colors.primary[600]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={dynamicStyles.historyItemText} numberOfLines={1}>
              {item.value}
            </Text>
            {item.createdAt && (
              <Text style={dynamicStyles.historyItemTime}>
                {formatTimeAgo(item.createdAt)}
              </Text>
            )}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            dynamicStyles.removeButton,
            pressed && { backgroundColor: colors.error[100] }
          ]}
          onPress={() => onRemoveHistoryItem(item)}
        >
          <FontAwesome6
            name="xmark"
            size={ms(12)}
            color={colors.error[600]}
          />
        </Pressable>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <View style={dynamicStyles.emptyStateIcon}>
        <FontAwesome6
          name="magnifying-glass"
          size={ms(24)}
          color={colors.primary[600]}
        />
      </View>
      <Text style={dynamicStyles.emptyStateText}>
        Commencez votre recherche
      </Text>
      <Text style={dynamicStyles.emptyStateSubtext}>
        Tapez quelque chose pour découvrir nos produits et services
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={dynamicStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={dynamicStyles.loadingText}>
        Chargement de l'historique...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={dynamicStyles.errorContainer}>
      <FontAwesome6
        name="triangle-exclamation"
        size={ms(16)}
        color={colors.error[600]}
      />
      <Text style={dynamicStyles.errorText}>{historyError}</Text>
      <Pressable style={dynamicStyles.retryButton} onPress={onRefreshHistory}>
        <Text style={dynamicStyles.retryText}>Réessayer</Text>
      </Pressable>
    </View>
  );

  return (
      <View style={dynamicStyles.container}>
        {/* Header Section */}
        <View style={dynamicStyles.headerSection}>
          <Text style={dynamicStyles.welcomeText}>Rechercher</Text>
          <Text style={dynamicStyles.subtitleText}>
            Trouvez exactement ce que vous cherchez
          </Text>
        </View>

        {/* Search Input Section */}
        <View style={dynamicStyles.searchSection}>
          <View style={dynamicStyles.searchInputWrapper}>
            <View
              style={[
                dynamicStyles.searchInputContainer,
                isFocused && dynamicStyles.searchInputContainerFocused,
              ]}
            >
              <FontAwesome6
                name="magnifying-glass"
                size={ms(16)}
                color={isFocused ? colors.primary[600] : colors.textSecondary}
                style={dynamicStyles.searchIcon}
              />
              <TextInput
                ref={searchInputRef}
                style={dynamicStyles.searchInput}
                placeholder="Que recherchez-vous ?"
                placeholderTextColor={colors.textSecondary}
                value={currentSearchQuery}
                onChangeText={onSearchQueryChange}
                onSubmitEditing={onSubmitEditing}
                onFocus={onFocus}
                onBlur={onBlur}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {currentSearchQuery.length > 0 && (
                <Pressable
                  style={({ pressed }) => [
                    dynamicStyles.clearButton,
                    pressed && { backgroundColor: colors.primary[200] }
                  ]}
                  onPress={onClearSearch}
                >
                  <FontAwesome6
                    name="xmark"
                    size={ms(12)}
                    color={colors.primary[600]}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <Text style={dynamicStyles.searchHint}>
            Appuyez sur Entrée pour rechercher
          </Text>
        </View>

        {/* History Section */}
        <View style={dynamicStyles.historySection}>
          {historyError && renderErrorState()}

          {searchHistory.length > 0 && (
            <View style={dynamicStyles.historyHeader}>
              <Text style={dynamicStyles.historyTitle}>Recherches récentes</Text>
              <Pressable
                style={({ pressed }) => [
                  dynamicStyles.clearAllButton,
                  pressed && { backgroundColor: colors.error[100] }
                ]}
                onPress={onClearHistory}
              >
                <Text style={dynamicStyles.clearAllText}>Tout effacer</Text>
              </Pressable>
            </View>
          )}

          <View style={dynamicStyles.historyList}>
            {isLoadingHistory ? (
              renderLoadingState()
            ) : searchHistory.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={searchHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item, index) =>
                  item.id?.toString() || `${item.value}-${index}`
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: ms(20) }}
              />
            )}
          </View>
        </View>
      </View>
  );
};

export default OnTypingSectionPresenter;
