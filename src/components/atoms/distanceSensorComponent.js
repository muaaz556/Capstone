import React, {useState, useEffect} from 'react';
import {Text, View, Vibration, BackHandler} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import {Button} from 'native-base';
// import {connectAndReceive} from '../../helper-functions/distanceSensor';
import {displayTextAlert} from '../../helper-functions/textAlert';
import {CHARACTERISTIC_UUID, DISTANCE_LIMIT, ENABLE_DISTANCE_SENSOR_VIBRATION, 
        SERVICE_UUID, VIBRATION_DURATION} from '../../assets/locale/en';
import {PermissionsAndroid} from 'react-native';

const bleManager = new BleManager();
let connectorDevice = null;
let scanInProgress = false;


//source: https://stackoverflow.com/questions/55813427/unable-to-use-react-native-bluetoothel
//gets location permission from user so that bluetooth can be used
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission for bluetooth scanning',
        message:
          'Please provide permission in order to connect to the distance sensor',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const distanceSensorComponent = ({
  enableVibration,
  distanceLimit,
  vibrationDuration,
  navigation,
}) => {
  var [connectionState, setConnectionState] = useState('Not connected');
  //this variable holds the connected bluetooth device info
  
  var distanceValue = 0;

  const handleBackButton = () => {
    if(connectorDevice != null){
      connectorDevice.cancelConnection().then(() => navigation.navigate('Login'))
    }
  }

  //this function searches and then sets up the bluetooth connection with a device
  function connectAndReceive() {
    scanInProgress = true;
    console.log("start scan", scanInProgress)
    //get permission to use phone location (needed for bluetooth)

    const permission = requestLocationPermission();
    //if permission given then continue
    if (permission) {
      //scan for devices
      bleManager.startDeviceScan(
        null,
        {allowDuplicates: false},
        (error, device) => {
          // scanInProgress = true;
          //if error occurs then stop the scan
          if (error) {
            console.log(error.message);
            return;
          }
          console.log(device.name, device.localName)
          //find the device named NanoBLE (this is the name set in the arduino code)
          if (
            device != null &&
            (device.name === 'NanoBLE' || device.localName === 'NanoBLE')
          ) {
            //the device has been found so we stop searching
            bleManager.stopDeviceScan();

            scanInProgress = false;
            console.log("stop scan", scanInProgress)
            //connect to the device
            device
              .connect()
              .then(
                device => {
                  return device.discoverAllServicesAndCharacteristics();
                },
                error => {
                  console.log('Failed to connect to NanoBLE');
                  return;
                },
              )
              .then(
                device => {
                  connectorDevice = device;
                  return;
                },
                error => {
                  console.log('Failed to find service');
                  return;
                },
              );
          }
        },
      );
    }
  }

  useEffect(() => {
    //This function runs every 0.5 seconds.
    //The job of this function is to read data
    //when connected to the bluetooth device every 0.5 seconds.
    //When not connected this function does nothing (in this
    //case connectorDevice is null).
    const interval = setInterval(() => {
      if (connectorDevice == null) {
        // console.log("conditions are met")
        // if(scanInProgress == false){
        //   console.log("conditions are met", scanInProgress)
        //   connectAndReceive()
        // }
        // connectAndReceive()
        return;
      }
      // if (!connectorDevice.isConnected()) {
      //   // console.log("conditions are met")
      //   console.log("connection status", connectorDevice.isConnected().then())
      //   if(scanInProgress == false){
      //     console.log("conditions are met", scanInProgress)
      //     connectAndReceive()
      //   }
      //   // connectAndReceive()
      //   return;
      // }
      //The service and characteristic UUID is set in the arduino code
      connectorDevice.isConnected().then((value)=> {
        if(value) {
        connectorDevice
        .readCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID)
        .then(
          characteristic => {
            //convert the received data in base64 (basically if not decoded the data looks like random stuff)
            console.log(base64.decode(characteristic.value));
            setConnectionState(base64.decode(characteristic.value) + 'cm');
            distanceValue = parseInt(base64.decode(characteristic.value));
            //if the distance is less than 100cm then make the phone vibrate
            if (distanceValue < distanceLimit && enableVibration)
              Vibration.vibrate(vibrationDuration);
              // displayTextAlert("OI", "BRUH STOP")
            return;
          },
          error => {
            console.log(connectorDevice);
            console.log(error);
            console.log('Failed to read characteristic');
            return;
          },
        );
        } else {

        }
        }
        )
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   //This function runs every 5 seconds
  //   //connectorDevice is null when not connected to a bluetooth device
  //   //the job of this function is to try to connect to a bluetooth device
  //   //every 5 seconds. When connected this function does nothing.
  //   const interval = setInterval(() => {
  //     console.log(bleManager)
  //     if (connectorDevice != null) {
  //       clearInterval(interval);
  //     } else {
        
  //       console.log('Trying to connect to device');
  //       connectAndReceive();
  //     }
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    connectorDevice = null;
    connectAndReceive();
    return () => backHandler.remove()
  }, []);


  return (
    <>
    <Text>
      {'Distance Reading: '}
      {connectionState}
    </Text>
    <Button
      onPress={() => {
        console.log("here", connectorDevice)
        if(connectorDevice != null){
          connectorDevice.cancelConnection().then(() => navigation.navigate('Login'))
        }
        // navigation.navigate('Login');
        }}>
      <Text>Guest Student</Text>
    </Button>
  </>
  );
};

export default distanceSensorComponent;