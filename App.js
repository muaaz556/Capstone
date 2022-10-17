import React, { useEffect } from 'react';

import {
  Text,
  View,
} from 'react-native';

import LoginScreen from "./src/screens/LoginScreen";

import SplashScreen from  "react-native-splash-screen";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  })

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;