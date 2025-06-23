import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  Switch,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";
import { FontAwesome6 } from "@expo/vector-icons";
import { SearchFilter } from "src/navigation/types";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";

interface FilterModalPresenterProps {
  isVisible: boolean;
  isLoadingCategories: boolean;
  isLoadingMarks: boolean;
  tempFilter: SearchFilter;
  activeFiltersCount: number;
  // Category options for the UI
  categoryOptions: Array<{label: string; value: string}>;
  selectedCategory?: {label: string; value: string};
  // Mark options for the UI
  markOptions: Array<{label: string; value: string}>;
  selectedMark?: {label: string; value: string};
  onClose: () => void;
  onCategorySelect: (categoryId: number, categoryName: string) => void;
  onMarkSelect: (markId: number, markName: string) => void;
  onPriceChange: (minPrice?: number, maxPrice?: number) => void;
  onMinPriceChange: (text: string) => void;
  onMaxPriceChange: (text: string) => void;
  onPromotionToggle: () => void;
  onClearAll: () => void;
  onClearIndividual: (filterType: 'category' | 'mark' | 'price' | 'promotion') => void;
  onApply: () => void;
  // Animation props
  slideAnim: Animated.Value;
  overlayOpacity: Animated.Value;
}

/**
 * Presenter component for FilterModal
 * Clean, modern UI for search filters with responsive design using react-native-size-matters
 */
const FilterModalPresenter: React.FC<FilterModalPresenterProps> = ({
  isVisible,
  isLoadingCategories,
  isLoadingMarks,
  tempFilter,
  activeFiltersCount,
  // Category options for the UI
  categoryOptions,
  selectedCategory,
  // Mark options for the UI
  markOptions,
  selectedMark,
  onClose,
  onCategorySelect,
  onMarkSelect,
  onPriceChange,
  onMinPriceChange,
  onMaxPriceChange,
  onPromotionToggle,
  onClearAll,
  onClearIndividual,
  onApply,
  slideAnim,
  overlayOpacity,
}) => {
  const colors = useColors();

  // Dynamic styles using react-native-size-matters for responsiveness - balanced color scheme (60/30/10 rule)
  const dynamicStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
      zIndex: 9999,
    },
    modalContainer: {
      backgroundColor: colors.background, // 60% - Dominant neutral
      borderTopLeftRadius: ms(20),
      borderTopRightRadius: ms(20),
      maxHeight: "85%",
      minHeight: "60%",
      paddingTop: ms(8),
      zIndex: 10000,
      shadowColor: colors.textSecondary,
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },
    dragIndicator: {
      width: ms(32),
      height: ms(3),
      backgroundColor: colors.border, // 60% - Neutral
      borderRadius: ms(2),
      alignSelf: "center",
      marginBottom: ms(12),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: ms(20),
      paddingBottom: ms(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border, // 60% - Neutral
    },
    headerTitle: {
      fontSize: ms(18),
      fontWeight: "700",
      color: colors.text, // 60% - Dominant text
    },
    closeButton: {
      padding: ms(6),
      borderRadius: ms(10),
      backgroundColor: colors.primary[100], // 30% - Subtle secondary
    },
    content: {
      flex: 1,
      minHeight: ms(150),
    },
    scrollContent: {
      paddingHorizontal: ms(20),
      paddingBottom: ms(20),
      paddingTop: ms(12),
      backgroundColor: colors.background, // 60% - Dominant neutral
    },
    section: {
      marginBottom: ms(20),
      backgroundColor: colors.surface, // 60% - Neutral background
      padding: ms(16),
      borderRadius: ms(14),
      borderWidth: 1,
      borderColor: colors.border, // 60% - Neutral border
      shadowColor: colors.textSecondary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: ms(14),
    },
    sectionTitle: {
      fontSize: ms(16),
      fontWeight: "700",
      color: colors.text, // 60% - Dominant text
      letterSpacing: 0.3,
      flex: 1,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: ms(6),
    },
    categoryChip: {
      paddingHorizontal: ms(14),
      paddingVertical: ms(8),
      borderRadius: ms(20),
      borderWidth: 2,
      borderColor: colors.primary[300],
      backgroundColor: colors.primary[50],
      marginBottom: ms(8),
      shadowColor: colors.primary[400],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    categoryChipActive: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[600],
      shadowColor: colors.primary[600],
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
      transform: [{ scale: 1.02 }],
    },
    categoryText: {
      fontSize: ms(13),
      fontWeight: "500",
      color: colors.primary[700],
    },
    categoryTextActive: {
      color: colors.primary[50],
      fontWeight: "600",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: ms(16),
    },
    loadingText: {
      fontSize: ms(13),
      color: colors.textSecondary, // 60% - Neutral text
      marginLeft: ms(10),
      fontWeight: "500",
    },
    priceContainer: {
      flexDirection: "row",
      gap: ms(12),
    },
    priceInputWrapper: {
      flex: 1,
    },
    priceLabel: {
      fontSize: ms(12),
      color: colors.textSecondary, // 60% - Neutral text
      marginBottom: ms(6),
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    promotionContainer: {
      backgroundColor: colors.surface, // 60% - Neutral background
      paddingHorizontal: ms(16),
      paddingVertical: ms(16),
      borderRadius: ms(12),
      borderWidth: 1,
      borderColor: colors.secondary[200], // 30% - Subtle secondary accent
      shadowColor: colors.textSecondary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    promotionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: ms(10),
    },
    promotionText: {
      fontSize: ms(15),
      fontWeight: "600",
      color: colors.text, // 60% - Dominant text
    },
    promotionSubtext: {
      fontSize: ms(12),
      color: colors.textSecondary, // 60% - Neutral text
      marginTop: ms(2),
      fontWeight: "500",
    },
    footer: {
      flexDirection: "row",
      paddingHorizontal: ms(20),
      paddingVertical: ms(20),
      paddingBottom: ms(30),
      backgroundColor: colors.surface, // 30% - Secondary background
      borderTopWidth: 1,
      borderTopColor: colors.border, // 60% - Neutral border
      gap: ms(12),
      shadowColor: colors.textSecondary,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    clearButton: {
      paddingHorizontal: ms(8),
      paddingVertical: ms(4),
      borderRadius: ms(6),
      backgroundColor: colors.error[100],
      borderWidth: 1,
      borderColor: colors.error[300],
    },
    clearButtonText: {
      fontSize: ms(11),
      fontWeight: "600",
      color: colors.error[700],
    },
    footerClearButton: {
      flex: 1,
      paddingVertical: ms(14),
      borderRadius: ms(16),
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.textSecondary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    footerClearButtonText: {
      fontSize: ms(14),
      fontWeight: "600",
      color: colors.textSecondary,
    },
    applyButton: {
      flex: 2,
      paddingVertical: ms(14),
      borderRadius: ms(16),
      backgroundColor: colors.secondary[500], // 10% - Main accent color
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      shadowColor: colors.secondary[600],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    applyButtonText: {
      fontSize: ms(14),
      fontWeight: "700",
      color: colors.background, // White text on accent
    },
    badgeContainer: {
      backgroundColor: colors.secondary[100], // 30% - Subtle secondary
      paddingHorizontal: ms(6),
      paddingVertical: ms(3),
      borderRadius: ms(10),
      marginLeft: ms(6),
      borderWidth: 1,
      borderColor: colors.secondary[200], // 30% - Subtle secondary
    },
    badgeText: {
      fontSize: ms(11),
      fontWeight: "700",
      color: colors.secondary[600], // 30% - Secondary text
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: ms(16),
    },
    emptyText: {
      fontSize: ms(13),
      color: colors.textSecondary, // 60% - Neutral text
      fontWeight: "500",
    },
  });

  const renderCategorySection = () => {
    return (
    <View style={dynamicStyles.section}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>Catégories</Text>
        <Pressable
          style={dynamicStyles.clearButton}
          onPress={() => onClearIndividual('category')}
        >
          <Text style={dynamicStyles.clearButtonText}>Effacer</Text>
        </Pressable>
      </View>
      {isLoadingCategories ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={dynamicStyles.loadingText}>Chargement...</Text>
        </View>
        ) : (
          <Input
            name="category"
            type={InputType.SEARCHABLE_SELECT}
            placeholder="Sélectionner une catégorie"
            searchPlaceholder="Rechercher une catégorie..."
            options={categoryOptions}
            selectedOption={selectedCategory}
            onSelectOption={(option) => {
              const categoryId = parseInt(option.value);
              onCategorySelect(categoryId, option.label);
            }}
            style={{
              backgroundColor: '#FFFFFF', // 60% - Neutral background
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: ms(12),
              shadowColor: colors.textSecondary,
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
      )}
    </View>
  );
  };

  const renderMarkSection = () => {
    return (
    <View style={dynamicStyles.section}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>Marques</Text>
        <Pressable
          style={dynamicStyles.clearButton}
          onPress={() => onClearIndividual('mark')}
        >
          <Text style={dynamicStyles.clearButtonText}>Effacer</Text>
        </Pressable>
      </View>
      {isLoadingMarks ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={dynamicStyles.loadingText}>Chargement...</Text>
        </View>
        ) : (
          <Input
            name="mark"
            type={InputType.SEARCHABLE_SELECT}
            placeholder="Sélectionner une marque"
            searchPlaceholder="Rechercher une marque..."
            options={markOptions}
            selectedOption={selectedMark}
            onSelectOption={(option) => {
              const markId = parseInt(option.value);
              onMarkSelect(markId, option.label);
            }}
            style={{
              backgroundColor: '#FFFFFF', // 60% - Neutral background
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: ms(12),
              shadowColor: colors.textSecondary,
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
      )}
    </View>
  );
  };

  const renderPriceSection = () => (
    <View style={dynamicStyles.section}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>Fourchette de prix</Text>
        <Pressable
          style={dynamicStyles.clearButton}
          onPress={() => onClearIndividual('price')}
        >
          <Text style={dynamicStyles.clearButtonText}>Effacer</Text>
        </Pressable>
      </View>
      <View style={dynamicStyles.priceContainer}>
        <View style={dynamicStyles.priceInputWrapper}>
          <Text style={dynamicStyles.priceLabel}>Prix minimum</Text>
          <Input
            name="minPrice"
            type={InputType.NUMERIC}
              placeholder="0"
              value={tempFilter.minPrice?.toString() || ""}
              onChangeText={onMinPriceChange}
            style={{
              backgroundColor: '#FFFFFF', // 60% - Neutral background
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: ms(12),
              paddingHorizontal: ms(14),
              paddingVertical: ms(12),
              fontSize: ms(14),
              color: colors.text,
              shadowColor: colors.textSecondary,
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>
        <View style={dynamicStyles.priceInputWrapper}>
          <Text style={dynamicStyles.priceLabel}>Prix maximum</Text>
          <Input
            name="maxPrice"
            type={InputType.NUMERIC}
              placeholder="∞"
              value={tempFilter.maxPrice?.toString() || ""}
              onChangeText={onMaxPriceChange}
            style={{
              backgroundColor: '#FFFFFF', // 60% - Neutral background
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: ms(12),
              paddingHorizontal: ms(14),
              paddingVertical: ms(12),
              fontSize: ms(14),
              color: colors.text,
              shadowColor: colors.textSecondary,
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>
      </View>
    </View>
  );

  const renderPromotionSection = () => (
    <View style={dynamicStyles.section}>
      <View style={dynamicStyles.sectionHeader}>
        <Text style={dynamicStyles.sectionTitle}>Options</Text>
        <Pressable
          style={dynamicStyles.clearButton}
          onPress={() => onClearIndividual('promotion')}
        >
          <Text style={dynamicStyles.clearButtonText}>Effacer</Text>
        </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [
          dynamicStyles.promotionContainer,
          pressed && { backgroundColor: colors.primary[100] }, // 30% - Subtle secondary
        ]}
        onPress={onPromotionToggle}
      >
        <View>
          <Text style={dynamicStyles.promotionText}>Articles en promotion</Text>
          <Text style={dynamicStyles.promotionSubtext}>
            Afficher uniquement les produits en promotion
          </Text>
        </View>
        <View style={dynamicStyles.promotionRow}>
          <Text style={[dynamicStyles.promotionSubtext, { flex: 1 }]}>
            {tempFilter.inPromotion ? "Activé" : "Désactivé"}
          </Text>
          <Switch
            value={tempFilter.inPromotion || false}
            onValueChange={onPromotionToggle}
            trackColor={{
              false: colors.border, // 60% - Neutral
              true: colors.secondary[500], // 10% - Accent when active
            }}
            thumbColor={
              tempFilter.inPromotion ? colors.background : colors.surface
            }
            ios_backgroundColor={colors.border}
          />
        </View>
      </Pressable>
    </View>
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={dynamicStyles.modalContainer}>
          {/* Drag Indicator */}
          <View style={dynamicStyles.dragIndicator} />

          {/* Header */}
          <View style={dynamicStyles.header}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={dynamicStyles.headerTitle}>Filtres de recherche</Text>
              {activeFiltersCount > 0 && (
                <View style={dynamicStyles.badgeContainer}>
                  <Text style={dynamicStyles.badgeText}>
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                dynamicStyles.closeButton,
                pressed && { backgroundColor: colors.primary[200] }, // 30% - Secondary
              ]}
              onPress={onClose}
            >
              <FontAwesome6
                name="xmark"
                size={ms(14)}
                color={colors.textSecondary} // 60% - Neutral
              />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={dynamicStyles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={dynamicStyles.scrollContent}>
              {renderCategorySection()}
              {renderMarkSection()}
              {renderPriceSection()}
              {renderPromotionSection()}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <Pressable
              style={({ pressed }) => [
                dynamicStyles.footerClearButton,
                pressed && { backgroundColor: colors.primary[100] }, // 30% - Secondary
              ]}
              onPress={onClearAll}
            >
              <Text style={dynamicStyles.footerClearButtonText}>Effacer tout</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                dynamicStyles.applyButton,
                pressed && { backgroundColor: colors.secondary[400] }, // 10% - Accent pressed
              ]}
              onPress={onApply}
            >
              <Text style={dynamicStyles.applyButtonText}>
                Appliquer les filtres
              </Text>
              {activeFiltersCount > 0 && (
                <View
                  style={[
                    dynamicStyles.badgeContainer,
                    { backgroundColor: colors.secondary[50], marginLeft: ms(6) }, // 30% - Secondary
                  ]}
                >
                  <Text
                    style={[
                      dynamicStyles.badgeText,
                      { color: colors.secondary[600] }, // 30% - Secondary
                    ]}
                  >
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModalPresenter; 