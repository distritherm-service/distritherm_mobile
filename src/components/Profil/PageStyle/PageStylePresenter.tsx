import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { ms } from "react-native-size-matters";
import { User } from "src/types/User";
import { colors } from "src/utils/colors";
import { isTablet } from "src/utils/deviceUtils";
import { NO_IMAGE_URL } from "src/utils/noImage";

const { width, height } = Dimensions.get("window");

interface PageStylePresenterProps {
  children?: React.ReactNode;
  user?: User;
  heightPercentage?: number;
  logoSize?: {
    width: number;
    height: number;
  };
}

const PageStylePresenter: React.FC<PageStylePresenterProps> = ({
  children,
  user,
  heightPercentage = 0.25,
  logoSize = { width: ms(120), height: ms(120) },
}) => {
  return (
    <SafeAreaView style={styles.root}>
      {/* Top background with logo */}
      <View style={[styles.topBackground, {height: height * heightPercentage}]}>
        <Image
          source={require("../../../../assets/logo-without-bg.png")}
          style={[styles.logo, {width: logoSize.width, height: logoSize.height}]}
          resizeMode="contain"
        />
      </View>

      {/* White rising container */}
      <ScrollView
        style={[styles.risingContainer, { flex: 1 }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>{children}</View>
      </ScrollView>
      {user && (
        <View style={styles.profilInfo}>
          <Image source={{ uri: user.urlPicture || NO_IMAGE_URL }} style={styles.profilImage} />
          <Text style={styles.profilName}>
            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'John Doe'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PageStylePresenter;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary[100],
    position: "relative"
  },
  topBackground: {
    backgroundColor: colors.tertiary[100],
    width: "100%",
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginBottom: ms(20),
  },
  risingContainer: {
    flex: 1,
    marginTop: -ms(32),
    zIndex: 10,
    backgroundColor: colors.primary[50],
    borderTopLeftRadius: ms(32),
    borderTopRightRadius: ms(32),
    shadowColor: colors.tertiary[900],
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSpace: {
    height: ms(80),
  },
  contentContainer: {
    flex: 1,
    padding: ms(25),
    zIndex: 10,
  },
  profilInfo: {
    alignItems: "center",
    position: "absolute",
    top: height * 0.17,
    width: "100%",
    alignSelf: "center",
    zIndex: 1000,
  },
  profilImage: {
    width: ms(120),
    height: ms(120),
    borderWidth: ms(2),
    borderColor: colors.primary[500],
    borderRadius: ms(30),
    marginBottom: ms(15),
    zIndex: 70,
  },
  profilName: {
    fontSize: ms(24),
    fontWeight: "bold",
    marginBottom: ms(8),
    color: colors.tertiary[900],
  },
  profilRole: {
    fontSize: ms(16),
    color: colors.tertiary[600],
  },
});
