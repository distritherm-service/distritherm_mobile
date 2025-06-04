import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/store/store";
import StackNavigator from "./src/navigation/StackNavigator";
import ApiProvider from "./src/providers/ApiProvider";
import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { View, ActivityIndicator } from "react-native";
import { scale } from "react-native-size-matters";

// Composant interne qui a accès au Redux store
function AppContent() {
  const { initialize, isAuthenticated } = useAuth();
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
            style="auto"
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
      <AppContent />
    </Provider>
  );
}
