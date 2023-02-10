import React, {useState, useEffect} from 'react';
import {Vibration, BackHandler} from 'react-native';
import base64 from 'react-native-base64';
import {connectAndReceive} from '../../helper-functions/distanceSensor';
import {CHARACTERISTIC_UUID, SERVICE_UUID} from '../../assets/locale/en';

const DistanceSensorComponent = ({
  enableVibration,
  distanceLimit,
  vibrationDuration,
  navigation,
}) => {
  
  var [displayDistanceValue, setDisplayDistanceValue] = useState('Not connected');
  
  //this variable holds the connected bluetooth device info
  let connectorDevice = null;
  let scanInProgress = false;
  var distanceValue = 0;
  
  // disconnects device after navigating backward from current screen
  const handleBackButton = () => {
    if(connectorDevice != null){
      connectorDevice.cancelConnection().then(() => navigation.navigate('Login'))
    } else {
      navigation.navigate('Login')
    }
  }

  // helper function updates value of device and scanStatus
  const updateDevice = (device, scanStatus) => {
    connectorDevice = device;
    scanInProgress = scanStatus;
  }
  
  // Reads data from arduino and updates value of distance
  const updateSensorReading = (characteristic) => {
    //convert the received data in base64 (basically if not decoded the data looks like random stuff)
    console.log(base64.decode(characteristic.value));
    setDisplayDistanceValue(base64.decode(characteristic.value) + 'cm');
    distanceValue = parseInt(base64.decode(characteristic.value));
    //if the distance is less than 100cm then make the phone vibrate
    if (distanceValue < distanceLimit && enableVibration)
      Vibration.vibrate(vibrationDuration);
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // set the connected device to null and then attempt to connect to a new device
    connectorDevice = null;
    connectAndReceive(updateDevice);

    //This function runs every 0.5 seconds.
    //The job of this function is to read data
    //when connected to the bluetooth device every 0.5 seconds.
    //When not connected this function sets connected device to null.
    const interval = setInterval(() => {
      if (connectorDevice == null) {
        if(scanInProgress == false){
          connectAndReceive(updateDevice)
        }
        return;
      }
      
      //The service and characteristic UUID is set in the arduino code
      connectorDevice.isConnected().then((isConnected)=> {
        if(isConnected) {
          connectorDevice
          .readCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID)
          .then(
            characteristic => {
              updateSensorReading(characteristic);
            },
            error => {
              console.log('Failed to read characteristic. ', "Error:", error);
            },
          );
        } else {
          connectorDevice = null
        }
      });
    }, 500);
    
    return () => {
      clearInterval(interval);
      backHandler.remove()
    };
  }, []);

  return (
    <>
    </>
  );
};

export default DistanceSensorComponent;