import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/HomeScreen/Home';
import BottomBarContainer from './BottomBar/BottomBar';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={BottomBarContainer} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
