import {SplashScreen} from 'expo';
import * as Font from 'expo-font';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import HomeScreen from './screens/HomeScreen';
import DistanceSensingScreen from './screens/DistanceSensingScreen';
import TTSScreen from './screens/TTSScreen';
import PathFindingAlgoScreen from './screens/PathFindingAlgoScreen';
import PathDiagramScreen from './screens/PathDiagramScreen';
import LocationScreen from './screens/LocationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
        <NavigationContainer theme={{colors: {background:'#e7f4fd'}}}>
          <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Distance"
              component={DistanceSensingScreen}
            />
            <Stack.Screen
              name="TTS"
              component={TTSScreen}
            />
            <Stack.Screen
              name="PathFinding"
              component={PathFindingAlgoScreen}
            />
            <Stack.Screen
              name="PathDiagram"
              component={PathDiagramScreen}
            />
            <Stack.Screen
              name="Location"
              component={LocationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f4fd',
  },
});
