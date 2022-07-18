/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
// import from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PermissionsAndroid,
  NativeModules, NativeEventEmitter,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64'

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const bleManager = new BleManager();


//source: https://stackoverflow.com/questions/55813427/unable-to-use-react-native-bluetoothel
export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Location permission for bluetooth scanning',
        message: 'wahtever',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ); 
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      //console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

// export function triggerUpdate() {
//   useEffect(() => {
//     // This will fire only on mount.
//     const interval = setInterval(() => {
//       connectAndReceive();
//     }, 10000);
  
//     return () => clearInterval(interval);
//   }, [])
// }
// const MyComponentWithNavigation = () => {
//   const navigate = useNavigate();

//   return <MyClassComponent {...props} navigate={navigate} />;
// };




 async function connectAndReceive() {

  const permission = requestLocationPermission();
    if (permission) {

    bleManager.startDeviceScan(null, {allowDuplicates: false}, (error, device) => {
      
      if (error) {
        console.log(error.message)
        return
      }
      //console.log(device.name)
      if (device.name === 'NanoBLE' || device.localName === 'NanoBLE') {
        bleManager.stopDeviceScan();
        device.connect()
        .then((device) => {
          return device.discoverAllServicesAndCharacteristics()
        })
          .then((device) => {
            return device.readCharacteristicForService("19b10000-e8f2-537e-4f6c-d104768a1214", "1A3AC131-31EF-758B-BC51-54A61958EF82")
          })
          .then((characteristic) => {
            console.log(base64.decode(characteristic.value))
            device.cancelConnection()
            return 
          }, (error) => {
            console.log("Failed to find service or characteristic")
            device.cancelConnection()
          })
      }
      
    })
  }

};



// async function setConnection() {
//   const permission = requestLocationPermission();
//     if (permission) {

//     bleManager.startDeviceScan(null, {allowDuplicates: false}, (error, device) => {
      
//       if (error) {
//         console.log(error.message)
//         return
//       }
//       //console.log(device.name)
//       if (device.name === 'NanoBLE' || device.localName === 'NanoBLE') {
//         bleManager.stopDeviceScan();
//         device.connect()
//         .then((device) => {
//           return device.discoverAllServicesAndCharacteristics()
//         })
//       }
//     })
//   }
// }

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // This will fire only on mount.
    const interval = setInterval(() => {
      connectAndReceive();
    }, 5000);

  
    return () => clearInterval(interval);
  }, [])

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Hello World">
            This is a basic react app.
          </Section>
          <Button title='Press' onPress={connectAndReceive}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
