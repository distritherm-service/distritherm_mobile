import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/HomeScreen/Home";
import BottomBarContainer from "./BottomBar/BottomBar";
import { AuthStackNavigator } from "./Auth/AuthStackNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomBarContainer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
