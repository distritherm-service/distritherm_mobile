import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import React from "react";
import { ms } from "react-native-size-matters";
import { Agency } from "src/types/Agency";
import { colors } from "src/utils/colors";
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
  onAgencySelect,
  onOpenBottomSheet,
  onCloseBottomSheet,
  searchValue,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <View>
          <Image
            source={require("@assets/logo-with-bg.jpg")}
            style={{ width: ms(80), height: ms(40), borderRadius: ms(20) }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Pressable style={styles.dropdownButton} onPress={onOpenBottomSheet}>
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <View style={styles.iconDot} />
              </View>
              <Text style={styles.dropdownButtonText} numberOfLines={1}>
                {selectedAgency?.name}
              </Text>
              <FontAwesomeIcon
                icon={isBottomSheetVisible ? faChevronUp : faChevronDown}
                size={ms(12)}
                color={colors.secondary[400]}
              />
            </View>
            <View style={styles.buttonGlow} />
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
                  },
                ]}
              >
                <View style={styles.bottomSheetHandle} />

                <View style={styles.bottomSheetHeader}>
                  <Text style={styles.bottomSheetTitle}>
                    Choisir une agence
                  </Text>
                  <Pressable
                    onPress={onCloseBottomSheet}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>

                {/* Debug: Afficher le nombre d'agences */}
                <Text style={styles.debugText}>
                  Agences disponibles: {agencies?.length || 0}
                </Text>

                {agencies && agencies.length > 0 ? (
                  <FlatList
                    data={agencies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[
                          styles.agencyItem,
                          selectedAgency?.id === item.id &&
                            styles.selectedAgencyItem,
                        ]}
                        onPress={() => onAgencySelect(item)}
                      >
                        <View style={styles.agencyItemContent}>
                          <View style={styles.agencyItemLeft}>
                            <View
                              style={[
                                styles.agencyIndicator,
                                selectedAgency?.id === item.id &&
                                  styles.selectedAgencyIndicator,
                              ]}
                            />
                            <Text
                              style={[
                                styles.agencyItemText,
                                selectedAgency?.id === item.id &&
                                  styles.selectedAgencyItemText,
                              ]}
                            >
                              {item.name}
                            </Text>
                          </View>
                          {selectedAgency?.id === item.id && (
                            <View style={styles.checkmarkContainer}>
                              <Text style={styles.checkmark}>✓</Text>
                            </View>
                          )}
                        </View>
                      </Pressable>
                    )}
                    showsVerticalScrollIndicator={false}
                    style={styles.agencyList}
                    contentContainerStyle={styles.agencyListContent}
                    nestedScrollEnabled={true}
                  />
                ) : (
                  <View style={styles.noAgenciesContainer}>
                    <Text style={styles.noAgenciesText}>
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

      <View style={styles.bottomContent}>
        <Input
          placeholder="Rechercher un produit"
          value={searchValue}
          onChangeText={onSearchChange}
          type={InputType.DEFAULT}
          leftLogo={faSearch}
        />
      </View>
    </View>
  );
};

export default HeaderPresenter;

const styles = StyleSheet.create({
  container: {
    padding: ms(5),
  },
  topContent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: ms(6),
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
    width: ms(170),
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.tertiary[500],
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.primary[50],
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingBottom: ms(20),
    minHeight: ms(300),
    maxHeight: ms(500),
    shadowColor: colors.tertiary[500],
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  bottomSheetHandle: {
    width: ms(40),
    height: ms(4),
    backgroundColor: colors.primary[400],
    borderRadius: ms(2),
    alignSelf: "center",
    marginTop: ms(8),
    marginBottom: ms(16),
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ms(20),
    paddingBottom: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[200],
  },
  bottomSheetTitle: {
    fontSize: ms(18),
    fontWeight: "700",
    color: colors.tertiary[500],
  },
  closeButton: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: colors.primary[200],
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: ms(14),
    color: colors.secondary[400],
    fontWeight: "bold",
  },
  debugText: {
    fontSize: ms(12),
    color: colors.secondary[400],
    textAlign: "center",
    marginBottom: ms(8),
    fontStyle: "italic",
  },
  agencyList: {
    flexGrow: 1,
    minHeight: ms(150),
  },
  agencyListContent: {
    paddingHorizontal: ms(20),
    paddingTop: ms(8),
    paddingBottom: ms(20),
  },
  agencyItem: {
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
    marginVertical: ms(4),
    borderRadius: ms(12),
    backgroundColor: colors.primary[100],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  selectedAgencyItem: {
    backgroundColor: `${colors.secondary[400]}15`,
    borderColor: colors.secondary[400],
    borderWidth: 2,
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
    backgroundColor: colors.primary[400],
    marginRight: ms(12),
  },
  selectedAgencyIndicator: {
    backgroundColor: colors.secondary[400],
  },
  agencyItemText: {
    fontSize: ms(16),
    color: colors.tertiary[500],
    fontWeight: "500",
    flex: 1,
  },
  selectedAgencyItemText: {
    color: colors.secondary[400],
    fontWeight: "600",
  },
  checkmarkContainer: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: colors.secondary[400],
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: ms(14),
    color: colors.primary[50],
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
    color: colors.tertiary[400],
    textAlign: "center",
  },
});
