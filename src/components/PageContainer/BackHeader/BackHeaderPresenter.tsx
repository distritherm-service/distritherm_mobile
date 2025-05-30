import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import colors from "src/utils/colors";

interface BackHeaderPresenterProps {
  title?: string;
  onBackPress: () => void;
  insets: EdgeInsets;
  hideBackButton?: boolean;
}

const BackHeaderPresenter: React.FC<BackHeaderPresenterProps> = ({
  title,
  onBackPress,
  insets,
  hideBackButton = false,
}) => {
  return (
    <View style={[styles.container]}>
      <View style={styles.headerContent}>
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

        {title && (
          <View style={[
            styles.titleContainer,
            hideBackButton && styles.titleContainerNoBack
          ]}>
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
    backgroundColor: colors.primary[50],
    zIndex: 10,
    height: ms(40),
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ms(16),
    height: '100%', // Prend toute la hauteur du container
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ms(6),
    borderRadius: ms(8),
    zIndex: 10,
    height: '100%', // Prend toute la hauteur disponible
    justifyContent: 'center', // Centre verticalement
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginLeft: -ms(50), // Pour centrer le titre en compensant le bouton retour
  },
  titleContainerNoBack: {
    marginLeft: 0,
  },
  title: {
    fontSize: ms(16),
    fontWeight: "600",
    color: colors.tertiary[500],
    textAlign: "center",
  },
  separator: {
    height: ms(1),
    backgroundColor: colors.primary[200],
    width: "100%",
  },
});
