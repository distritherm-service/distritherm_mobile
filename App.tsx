import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css"

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-white">
      <StatusBar style="auto" />
      <View className="p-8 rounded-xl shadow-lg bg-white border-2 border-blue-200">
        <Text className="text-3xl font-extrabold text-blue-700 text-center">
          Bienvenue Medis
        </Text>
        <Text className="mt-2 text-blue-600 text-center font-medium">
          Votre partenaire en solutions constructivesqsdfa
        </Text>
      </View>
    </View>
  );
}