import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import BottomBarContainer from "./BottomBar/BottomBar";
import { AuthStackNavigator } from "./Auth/AuthStackNavigator";
import PersonalInformation from "../screens/PersonalInformationScreen/PersonalInformation";
import ForgotPassword from "../screens/ForgotPasswordScreen/ForgotPassword";
import Product from "src/screens/ProductScreen/Product";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomBarContainer} />
      {!isAuthenticated && (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
      <Stack.Screen name="PersonalInformation" component={PersonalInformation} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen 
        name="Product" 
        component={Product}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
