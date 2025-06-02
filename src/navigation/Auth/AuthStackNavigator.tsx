import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "src/screens/Login/Login";
import Register from "src/screens/Register/Register";

const AuthStack = createNativeStackNavigator();

export const AuthStackNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          animation: "slide_from_left",
          gestureDirection: "horizontal",
          gestureEnabled: true,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{
          animation: "slide_from_right",
          gestureDirection: "horizontal",
          gestureEnabled: true,
        }}
      />
    </AuthStack.Navigator>
  );
};
