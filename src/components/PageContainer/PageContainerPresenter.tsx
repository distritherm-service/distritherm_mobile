import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StatusBar,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale as ms } from "react-native-size-matters";
import { colors } from "../../utils/colors";

interface PageContainerPresenterProps {
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const PageContainerPresenter: React.FC<PageContainerPresenterProps> = ({
  headerComponent,
  children,
  style,
  contentStyle,
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
        style={[styles.safeContainer, style]}
        edges={["top", "bottom"]}
      >
        {headerComponent}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
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
