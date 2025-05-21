import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/store/store";
import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar style="auto" translucent={true} backgroundColor="transparent" />
          <StackNavigator />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
