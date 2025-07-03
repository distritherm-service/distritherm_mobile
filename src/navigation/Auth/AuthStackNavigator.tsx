import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../screens/LoginScreen";
import Register from "../../screens/Register";
import { AuthStackParamList } from "../types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

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
