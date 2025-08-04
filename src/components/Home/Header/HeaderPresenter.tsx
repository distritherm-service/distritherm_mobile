import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  Modal,
  FlatList,
  Animated,
  TextInput,
} from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { Agency } from "src/types/Agency";
import { useColors } from "src/hooks/useColors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faChevronUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import Input from "src/components/Input/Input";
import { InputType } from "src/types/InputType";

interface HeaderPresenterProps {
  agencies: Agency[] | null;
  selectedAgency: Agency | null;
  isBottomSheetVisible: boolean;
  slideAnim: Animated.Value;
  backdropOpacity: Animated.AnimatedInterpolation<string | number>;
  headerTranslateY: Animated.Value;
  onAgencySelect: (agency: Agency) => void;
  onOpenBottomSheet: () => void;
  onCloseBottomSheet: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const HeaderPresenter: React.FC<HeaderPresenterProps> = ({
  agencies,
  selectedAgency,
  isBottomSheetVisible,
  slideAnim,
  backdropOpacity,
  headerTranslateY,
  onAgencySelect,
  onOpenBottomSheet,
  onCloseBottomSheet,
  searchValue,
  onSearchChange,
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: colors.background,
      paddingTop: ms(50), // Espace pour la status bar
      paddingHorizontal: ms(5),
    },
    topContent: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bottomContent: {
      width: "90%",
      alignSelf: "center",
      marginTop: ms(10)
    },
    dropdownContainer: {
      position: "relative",
      paddingRight: ms(15)
    },
    dropdownButton: {
      width: ms(120),
      height: ms(36),
      borderRadius: ms(18),
      backgroundColor: colors.primary[50],
      position: "relative",
      overflow: "hidden",
      shadowColor: colors.secondary[400],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    buttonContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: ms(12),
      zIndex: 2,
    },
    buttonGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: ms(18),
      backgroundColor: `${colors.secondary[400]}10`,
      borderWidth: 1,
      borderColor: `${colors.secondary[400]}20`,
    },
    iconContainer: {
      width: ms(16),
      height: ms(16),
      borderRadius: ms(8),
      backgroundColor: `${colors.secondary[400]}20`,
      alignItems: "center",
      justifyContent: "center",
      marginRight: ms(8),
    },
    iconDot: {
      width: ms(6),
      height: ms(6),
      borderRadius: ms(3),
      backgroundColor: colors.secondary[400],
    },
    dropdownButtonText: {
      flex: 1,
      fontSize: ms(12),
      color: colors.tertiary[500],
      fontWeight: "600",
    },
  });

  return (
    <Animated.View 
      style={[
        dynamicStyles.container,
        {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <View style={dynamicStyles.topContent}>
        <View>
          <Image
            source={require("@assets/logo-with-bg.jpg")}
            style={{ width: ms(80), height: ms(40), borderRadius: ms(20) }}
            resizeMode="contain"
          />
        </View>

        <View style={dynamicStyles.dropdownContainer}>
          <Pressable style={dynamicStyles.dropdownButton} onPress={onOpenBottomSheet}>
            <View style={dynamicStyles.buttonContent}>
              <View style={dynamicStyles.iconContainer}>
                <View style={dynamicStyles.iconDot} />
              </View>
              <Text style={dynamicStyles.dropdownButtonText} numberOfLines={1}>
                {selectedAgency?.name}
              </Text>
              <FontAwesomeIcon
                icon={isBottomSheetVisible ? faChevronUp : faChevronDown}
                size={ms(12)}
                color={colors.secondary[400]}
              />
            </View>
            <View style={dynamicStyles.buttonGlow} />
          </Pressable>

          <Modal
            visible={isBottomSheetVisible}
            transparent={true}
            animationType="none"
            onRequestClose={onCloseBottomSheet}
            statusBarTranslucent={true}
          >
            <View style={styles.modalContainer}>
              <Animated.View
                style={[
                  styles.backdrop,
                  {
                    opacity: backdropOpacity,
                  },
                ]}
              >
                <Pressable
                  style={styles.backdropPressable}
                  onPress={onCloseBottomSheet}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.bottomSheet,
                  {
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <View style={[styles.bottomSheetHeader, { backgroundColor: colors.surface }]}>
                  <View style={[styles.bottomSheetHandle, { backgroundColor: colors.border }]} />
                  <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>
                    Sélectionner une agence
                  </Text>
                </View>

                {agencies && agencies.length > 0 ? (
                  <FlatList
                    data={agencies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[
                          styles.agencyItem,
                          { backgroundColor: colors.surface },
                          selectedAgency?.id === item.id && {
                            backgroundColor: colors.secondary[50],
                          },
                        ]}
                        onPress={() => onAgencySelect(item)}
                      >
                        <View style={styles.agencyItemContent}>
                          <View style={styles.agencyItemLeft}>
                            <View
                              style={[
                                styles.agencyIndicator,
                                { backgroundColor: colors.primary[400] },
                                selectedAgency?.id === item.id && {
                                  backgroundColor: colors.secondary[400],
                                },
                              ]}
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.agencyItemText,
                                  { color: colors.text },
                                  selectedAgency?.id === item.id && {
                                    color: colors.secondary[400],
                                    fontWeight: "600",
                                  },
                                ]}
                                numberOfLines={2}
                              >
                                {item.name}
                              </Text>
                              {item.city && (
                                <Text
                                  style={[
                                    styles.agencySubText,
                                    { color: colors.textSecondary },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {item.city} - {item.postalCode}
                                </Text>
                              )}
                            </View>
                          </View>
                          {selectedAgency?.id === item.id && (
                            <View style={[styles.checkmarkContainer, { backgroundColor: colors.secondary[400] }]}>
                              <Text style={[styles.checkmark, { color: colors.primary[50] }]}>✓</Text>
                            </View>
                          )}
                        </View>
                      </Pressable>
                    )}
                    showsVerticalScrollIndicator={true}
                    style={styles.agencyList}
                    contentContainerStyle={styles.agencyListContent}
                    nestedScrollEnabled={true}
                    bounces={true}
                    removeClippedSubviews={false}
                  />
                ) : (
                  <View style={styles.noAgenciesContainer}>
                    <Text style={[styles.noAgenciesText, { color: colors.textSecondary }]}>
                      {agencies === null
                        ? "Chargement des agences..."
                        : "Aucune agence disponible"}
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={dynamicStyles.bottomContent}>
        {/* <Input
          name="search" 
          placeholder="Rechercher un produit"
          value={searchValue}
          onChangeText={onSearchChange}
          type={InputType.DEFAULT}
          leftLogo={faSearch}
        /> */}
      </View>
    </Animated.View>
  );
};

export default HeaderPresenter;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingBottom: ms(40),
    maxHeight: "70%",
    minHeight: ms(300),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: ms(-4) },
    shadowOpacity: 0.25,
    shadowRadius: ms(12),
    elevation: 12,
    zIndex: 1000,
  },
  bottomSheetHeader: {
    paddingTop: ms(16),
    paddingBottom: ms(20),
    paddingHorizontal: ms(24),
    alignItems: "center",
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
  },
  bottomSheetHandle: {
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    marginBottom: ms(16),
  },
  bottomSheetTitle: {
    fontSize: ms(18),
    fontWeight: "700",
    textAlign: "center",
  },
  agencyList: {
    flex: 1,
    paddingHorizontal: ms(24),
    minHeight: ms(200),
  },
  agencyListContent: {
    paddingBottom: ms(20),
    flexGrow: 1,
  },
  agencyItem: {
    paddingVertical: ms(16),
    paddingHorizontal: ms(20),
    marginVertical: ms(2),
    borderRadius: ms(12),
    minHeight: ms(60),
  },
  agencyItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  agencyItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  agencyIndicator: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginRight: ms(12),
  },
  agencyItemText: {
    fontSize: ms(16),
    fontWeight: "500",
    flex: 1,
  },
  agencySubText: {
    fontSize: ms(12),
    fontWeight: "400",
    marginTop: ms(4),
  },
  checkmarkContainer: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: ms(14),
    fontWeight: "bold",
  },
  noAgenciesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: ms(40),
  },
  noAgenciesText: {
    fontSize: ms(16),
    textAlign: "center",
  },
});
