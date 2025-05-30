import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StatusBar,
  ViewStyle,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import colors from "src/utils/colors";

interface PageContainerPresenterProps {
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  isScrollable?: boolean;
  bottomBar?: boolean;
}

const PageContainerPresenter: React.FC<PageContainerPresenterProps> = ({
  headerComponent,
  children,
  style,
  contentStyle,
  isScrollable = false,
  bottomBar = true,
}) => {
  // Ajuster le padding pour éviter que le contenu touche le bas

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView
        style={[styles.safeContainer, !bottomBar && {paddingBottom: 0}, style]}
        edges={["top", "bottom"]}
      >
        {headerComponent}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          {isScrollable ? (
            <ScrollView
              style={[styles.scrollView, contentStyle]}
              contentContainerStyle={[styles.scrollContent]}
              showsVerticalScrollIndicator={false}
              bounces={false}
              automaticallyAdjustContentInsets={false}
              contentInsetAdjustmentBehavior="never"
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.scrollView, contentStyle, styles.scrollContent]}>
              {children}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default PageContainerPresenter;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.primary[50],
    paddingBottom: Platform.OS == "ios" ? ms(47) : ms(65),
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
