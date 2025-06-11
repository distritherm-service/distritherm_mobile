import React from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import colors from "src/utils/colors";

interface BackHeaderPresenterProps {
  title?: string;
  onBackPress: () => void;
  hideBackButton?: boolean;
  titleLeft?: boolean;
}

const BackHeaderPresenter: React.FC<BackHeaderPresenterProps> = ({
  title,
  onBackPress,
  hideBackButton = false,
  titleLeft = false,
}) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.headerContent}>
        {/* Section gauche - Bouton retour */}
        <View
          style={[styles.leftSection, titleLeft && styles.leftSectionExpanded]}
        >
          {!hideBackButton && (
            <Pressable
              onPress={onBackPress}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              android_ripple={{
                color: `${colors.secondary[400]}30`,
                borderless: true,
                radius: ms(20),
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={ms(16)}
                color={colors.secondary[500]}
              />
              <Text style={styles.backText}>Retour</Text>
            </Pressable>
          )}

          {title && titleLeft && (
            <View style={styles.titleLeftContainer}>
              <Text
                style={[styles.title, styles.titleLeft]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
            </View>
          )}
        </View>

        {/* Section droite - Titre centré (seulement si titleLeft est false) */}
        {!titleLeft && (
          <View style={styles.titleSection}>
            <View style={styles.titleCenteringContainer}>
              {title && (
                <Text
                  style={[styles.title, styles.titleCentered]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
              )}
            </View>
            <View style={styles.titleExtensionSpace} />
          </View>
        )}
      </View>
    </View>
  );
};

export default BackHeaderPresenter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
    justifyContent: "center",
    backgroundColor: colors.primary[50],
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(16),
    height: ms(50),
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  leftSectionExpanded: {
    flex: 3,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(6),
    borderRadius: ms(8),
    height: "100%",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: `${colors.secondary[400]}15`,
  },
  backText: {
    fontSize: ms(14),
    fontWeight: "500",
    color: colors.secondary[500],
    marginLeft: ms(4),
  },
  titleSection: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  titleCenteringContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleExtensionSpace: {
    flex: 1,
  },
  title: {
    fontSize: ms(16),
    fontWeight: "600",
    color: colors.tertiary[500],
  },
  titleCentered: {
    textAlign: "center",
    width: "100%",
  },
  titleLeftContainer: {
    flex: 1,
    marginLeft: ms(10),
  },
  titleLeft: {
    textAlign: "left",
  },
  separator: {
    height: ms(1),
    backgroundColor: colors.primary[200],
    width: "100%",
  },
});
