import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/store/store";
import StackNavigator from "./src/navigation/StackNavigator";
import ApiProvider from "./src/providers/ApiProvider";
import { ThemeProvider, useTheme } from "./src/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { scale } from "react-native-size-matters";

// Composant interne qui a accès au Redux store et au ThemeProvider
function AppContent() {
  const { initialize, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setIsInitializing(false);
    };
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={scale(24)} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ApiProvider>
          <StatusBar
            style={isDark ? "light" : "dark"}
            translucent={true}
            backgroundColor="transparent"
          />
          <StackNavigator />
        </ApiProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
