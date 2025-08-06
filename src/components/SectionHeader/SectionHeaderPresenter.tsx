import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ms } from "react-native-size-matters"; // Using react-native-size-matters for responsive design
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useColors } from "src/hooks/useColors";
import { SectionHeaderProps } from "./SectionHeader";

const SectionHeaderPresenter: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  badgeCount,
  badgeColor = 'secondary',
  showBadge = true,
}) => {
  const colors = useColors();

  const dynamicStyles = StyleSheet.create({
    // Compact modern header with tertiary colors
    headerContainer: {
      backgroundColor: colors.tertiary[500], // Using tertiary color
      paddingHorizontal: ms(16),
      paddingTop: ms(10),
      paddingBottom: ms(12),
      borderBottomLeftRadius: ms(20),
      borderBottomRightRadius: ms(20),
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(4) },
      shadowOpacity: 0.10,
      shadowRadius: ms(8),
      elevation: 6,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    headerIcon: {
      backgroundColor: colors.tertiary[100],
      width: ms(32),
      height: ms(32),
      borderRadius: ms(16),
      justifyContent: "center",
      alignItems: "center",
      marginRight: ms(10),
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      color: colors.primary[50],
      fontSize: ms(18),
      fontWeight: "800",
      letterSpacing: ms(0.2),
    },
    headerSubtitle: {
      color: colors.tertiary[200],
      fontSize: ms(11),
      fontWeight: "500",
      marginTop: ms(1),
    },
    headerBadge: {
      backgroundColor: colors[badgeColor][500],
      minWidth: ms(28),
      height: ms(28),
      borderRadius: ms(14),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(8),
      shadowColor: colors[badgeColor][400],
      shadowOffset: { width: 0, height: ms(2) },
      shadowOpacity: 0.20,
      shadowRadius: ms(4),
      elevation: 4,
    },
    headerBadgeText: {
      color: colors.primary[50],
      fontSize: ms(12),
      fontWeight: "700",
    },
  });

  return (
    <View style={dynamicStyles.headerContainer}>
      <View style={dynamicStyles.headerContent}>
        <View style={dynamicStyles.headerLeft}>
          <View style={dynamicStyles.headerIcon}>
            <FontAwesomeIcon
              icon={icon}
              size={ms(16)}
              color={colors.tertiary[500]}
            />
          </View>
          <View style={dynamicStyles.headerTextContainer}>
            <Text style={dynamicStyles.headerTitle}>{title}</Text>
            {subtitle && (
              <Text style={dynamicStyles.headerSubtitle}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {showBadge && badgeCount !== undefined && badgeCount > 0 && (
          <View style={dynamicStyles.headerBadge}>
            <Text style={dynamicStyles.headerBadgeText}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SectionHeaderPresenter; 