import React, { useEffect } from 'react';

import {
  Text,
  View,
} from 'react-native';

import LoginScreen from "./src/screens/LoginScreen";
import AdminHomeScreen from './src/screens/AdminHomeScreen';
import GPSTestScreen from './src/screens/GPSTestScreen';

import SplashScreen from  "react-native-splash-screen";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NativeBaseProvider } from "native-base";

const Stack = createNativeStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  })

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />

          <Stack.Screen name="GPSTestScreen" component={GPSTestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;

//adding random comment to make pull request