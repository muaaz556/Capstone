import React, {useState, useEffect} from 'react';
import {Text, View, Vibration} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import {Button} from 'native-base';
import {connectAndReceive} from '../../assets/helperfunctions/DistanceSensorHelperFunctions';
import {
  CHARACTERISTIC_UUID,
  DISTANCE_LIMIT,
  ENABLE_DISTANCE_SENSOR_VIBRATION,
  SERVICE_UUID,
  VIBRATION_DURATION,
} from '../../common/constants';

const bleManager = new BleManager();

const DistanceSensingComponent = ({enableVibration, distanceLimit, vibrationDuration}) => {
  var [distanceReading, setDistanceReading] = useState('Not connected');
  //this variable holds the connected bluetooth device info
  var connectorDevice = null;
  var distanceValue = 0;

  useEffect(() => {
    //This function runs every 0.5 seconds.
    //The job of this function is to read data
    //when connected to the bluetooth device every 0.5 seconds.
    //When not connected this function does nothing (in this
    //case connectorDevice is null).
    const interval = setInterval(() => {
      if (connectorDevice == null) {
        return;
      }
      //The service and characteristic UUID is set in the arduino code
      connectorDevice
        .readCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID)
        .then(
          characteristic => {
            //convert the received data in base64 (basically if not decoded the data looks like random stuff)
            console.log(base64.decode(characteristic.value));
            setDistanceReading(base64.decode(characteristic.value) + 'cm');
            distanceValue = parseInt(base64.decode(characteristic.value));
            //if the distance is less than 100cm then make the phone vibrate
            if (
              distanceValue < distanceLimit &&
              enableVibration
            )
              Vibration.vibrate(vibrationDuration);
            return;
          },
          error => {
            console.log(connectorDevice);
            console.log(error);
            console.log('Failed to read characteristic');
            return;
          },
        );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //This function runs every 5 seconds
    //connectorDevice is null when not connected to a bluetooth device
    //the job of this function is to try to connect to a bluetooth device
    //every 5 seconds. When connected this function does nothing.
    const interval = setInterval(() => {
      if (connectorDevice != null) {
        clearInterval(interval);
      } else {
        console.log('Trying to connect to device');
        connectAndReceive(bleManager, connectorDevice);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text>
      {'Distance Reading: '}
      {distanceReading}
    </Text>
  );
};

export default DistanceSensingComponent;
