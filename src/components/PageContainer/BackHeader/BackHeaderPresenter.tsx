import React from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import { useColors } from "src/hooks/useColors";

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
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      width: "100%",
      zIndex: 10,
      justifyContent: "center",
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
      paddingHorizontal: ms(8),
      paddingVertical: 0,
      borderRadius: ms(8),
      height: "100%",
      justifyContent: "center",
      minHeight: ms(50),
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
      color: colors.text,
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
      backgroundColor: colors.border,
      width: "100%",
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headerContent}>
        {/* Section gauche - Bouton retour */}
        <View
          style={[dynamicStyles.leftSection, titleLeft && dynamicStyles.leftSectionExpanded]}
        >
          {!hideBackButton && (
            <Pressable
              onPress={onBackPress}
              style={({ pressed }) => [
                dynamicStyles.backButton,
                pressed && dynamicStyles.buttonPressed,
              ]}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={ms(16)}
                color={colors.secondary[500]}
              />
              <Text style={dynamicStyles.backText}>Retour</Text>
            </Pressable>
          )}

          {title && titleLeft && (
            <View style={dynamicStyles.titleLeftContainer}>
              <Text
                style={[dynamicStyles.title, dynamicStyles.titleLeft]}
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
          <View style={dynamicStyles.titleSection}>
            <View style={dynamicStyles.titleCenteringContainer}>
              {title && (
                <Text
                  style={[dynamicStyles.title, dynamicStyles.titleCentered]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
              )}
            </View>
            <View style={dynamicStyles.titleExtensionSpace} />
          </View>
        )}

        
      </View>
      
      {/* Gray separator line */}
      <View style={dynamicStyles.separator} />
    </View>
  );
};

export default BackHeaderPresenter;
