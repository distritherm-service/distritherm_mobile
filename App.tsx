import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import store from "./src/store/store";
import StackNavigator from "./src/navigation/StackNavigator";
import ApiProvider from "./src/providers/ApiProvider";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <ApiProvider>
            <StatusBar style="auto" translucent={true} backgroundColor="transparent" />
            <StackNavigator />
          </ApiProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
