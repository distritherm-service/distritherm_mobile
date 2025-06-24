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
    // Modern header with tertiary colors
    headerContainer: {
      backgroundColor: colors.tertiary[500], // Using tertiary color
      paddingHorizontal: ms(20),
      paddingTop: ms(16),
      paddingBottom: ms(20),
      borderBottomLeftRadius: ms(24),
      borderBottomRightRadius: ms(24),
      shadowColor: colors.tertiary[400],
      shadowOffset: { width: 0, height: ms(6) },
      shadowOpacity: 0.12,
      shadowRadius: ms(12),
      elevation: 8,
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
      width: ms(40),
      height: ms(40),
      borderRadius: ms(20),
      justifyContent: "center",
      alignItems: "center",
      marginRight: ms(12),
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      color: colors.primary[50],
      fontSize: ms(20),
      fontWeight: "800",
      letterSpacing: ms(0.3),
    },
    headerSubtitle: {
      color: colors.tertiary[200],
      fontSize: ms(12),
      fontWeight: "500",
      marginTop: ms(2),
    },
    headerBadge: {
      backgroundColor: colors[badgeColor][500],
      minWidth: ms(32),
      height: ms(32),
      borderRadius: ms(16),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: ms(10),
      shadowColor: colors[badgeColor][400],
      shadowOffset: { width: 0, height: ms(3) },
      shadowOpacity: 0.25,
      shadowRadius: ms(6),
      elevation: 5,
    },
    headerBadgeText: {
      color: colors.primary[50],
      fontSize: ms(14),
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
              size={ms(20)}
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