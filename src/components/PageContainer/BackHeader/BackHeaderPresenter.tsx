import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import { colors } from "../../../utils/colors";

interface BackHeaderPresenterProps {
  title?: string;
  onBackPress: () => void;
  insets: any;
}

const BackHeaderPresenter: React.FC<BackHeaderPresenterProps> = ({
  title,
  onBackPress,
  insets,
}) => {
  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, ms(8)) }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContent}>
        <Pressable
          onPress={onBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          android_ripple={{
            color: "rgba(0, 0, 0, 0.1)",
            borderless: true,
            radius: ms(20),
          }}
        >
          <Ionicons name="chevron-back" size={ms(20)} color="#0066cc" />
          <Text style={styles.backText}>Retour</Text>
        </Pressable>

        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.separator} />
    </View>
  );
};

export default BackHeaderPresenter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: ms(1) },
        shadowOpacity: 0.05,
        shadowRadius: ms(2),
      },
      android: {
        elevation: ms(2),
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(12),
    paddingBottom: ms(8),
    paddingTop: ms(4),
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: ms(4),
    paddingHorizontal: ms(2),
    borderRadius: ms(6),
    zIndex: 10,
  },
  buttonPressed: {
    backgroundColor: "rgba(0, 102, 204, 0.1)",
  },
  backText: {
    fontSize: ms(14),
    fontWeight: "500",
    color: "#0066cc",
    marginLeft: 0,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: ms(8), 
  },
  title: {
    fontSize: ms(16),
    fontWeight: "600" as const,
    color: colors.text,
    textAlign: "left",
  },
  separator: {
    height: ms(0.5),
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: "100%",
  },
});
