import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale as ms } from 'react-native-size-matters';


interface PageContainerPresenterProps {
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
  style?: object;
  contentStyle?: object;
  bottomPadding: number;
  topPadding: number;
}

const PageContainerPresenter: React.FC<PageContainerPresenterProps> = ({
  headerComponent,
  children,
  style,
  contentStyle,
  bottomPadding,
  topPadding,
}) => {
  // Ajuster le padding pour éviter que le contenu touche le bas
  // Utiliser une valeur fixe pour le paddingBottom quand il est utilisé avec BottomBar
  const paddingBottomValue = ms(5);
  
  return (
    <SafeAreaView
      style={[styles.safeContainer, style]}
      edges={["bottom"]}
    >
      {headerComponent}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={[
            styles.scrollView,
            contentStyle,
          ]}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: paddingBottomValue,
              paddingTop: topPadding > 0 ? ms(topPadding) : 0,
            }
          ]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PageContainerPresenter;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ms(16),
  },
});
