import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from "native-base";

// import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

import { NativeModules, NativeEventEmitter } from 'react-native';

const {AccelerometerSensorModule, GyroscopeSensorModule, SensorActivityModule} = NativeModules;
let subscription = null;

// let subscription = null;
// let prevTimestamp = 0;

const TestSensorModulesScreen = ({ }) => {

  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [distance, setDistance] = useState({ x: 0, y: 0, z: 0 });
  const [prevAccelData, setPrevAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [prevVelocity, setPrevVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [prevDistance, setPrevDistance] = useState({ x: 0, y: 0, z: 0 });
  const [time, setTime] = useState(new Date().getTime());
  const [timeInterval, setTimeInterval] = useState(0.1);

  useEffect(() => {
    const calculateDistance = () => {
      const currTime = new Date().getTime();
      const deltaTime = (currTime - time) / 1000; // convert to seconds
      setTime(currTime);

      const calculateVelocity = (accel, prevVelocity) => {
        const k1 = accel;
        const k2 = (accel + k1 * deltaTime / 2);
        const k3 = (accel + k2 * deltaTime / 2);
        const k4 = (accel + k3 * deltaTime);
        const newVelocity = prevVelocity + deltaTime * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        return newVelocity;
      };

      const calculateDistanceFromVelocity = (velocity, prevDistance) => {
        const k1 = velocity;
        const k2 = (velocity + k1 * deltaTime / 2);
        const k3 = (velocity + k2 * deltaTime / 2);
        const k4 = (velocity + k3 * deltaTime);
        const newDistance = prevDistance * deltaTime + deltaTime * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        return newDistance;
      };

      const newVelocity = {
        x: calculateVelocity((accelData.x + prevAccelData.x) / 2, prevVelocity.x),
        y: calculateVelocity((accelData.y + prevAccelData.y) / 2, prevVelocity.y),
        z: calculateVelocity((accelData.z + prevAccelData.z) / 2, prevVelocity.z)
      };
      setVelocity(newVelocity);

      const newDistance = {
        x: calculateDistanceFromVelocity((velocity.x + prevVelocity.x) / 2, prevDistance.x),
        y: calculateDistanceFromVelocity((velocity.y + prevVelocity.y) / 2, prevDistance.y),
        z: calculateDistanceFromVelocity((velocity.z + prevVelocity.z) / 2, prevDistance.z)
      };
      setDistance(newDistance);
      console.log(newDistance);

      setPrevAccelData(accelData);
      setPrevVelocity(newVelocity);
      setPrevDistance(newDistance);
    };

    const intervalId = setInterval(calculateDistance, timeInterval * 1000);
    return () => clearInterval(intervalId);
  }, [accelData, prevAccelData, prevVelocity, prevDistance, time, timeInterval]);

    const startAccelerometer = () => {
        // SensorEventModule.printTemp();
        console.log("r u working accelerometer")
        AccelerometerSensorModule?.startAccelerationSensor();

        const eventEmitter = new NativeEventEmitter();

        subscription = eventEmitter.addListener(
            'AccelerometerModule',
            (data) => {
                // testing to see if we can see the values of accelerometer
                console.log(data);
                setAccelData({})
            },
        );
    }

    const stopAccelerometer = () =>{
        console.log("Stop Listening");
        AccelerometerSensorModule?.stopAccelerationSensor();
        subscription?.remove();
    }

    const startSensors = () => {
      // SensorEventModule.printTemp();
      console.log("r u working SensorActivityModule")
      SensorActivityModule?.startSensors();

      const eventEmitter = new NativeEventEmitter();

      subscription = eventEmitter.addListener(
          'SensorActivityModule',
          (data) => {
              // testing to see if we can see the values of SensorActivityModule
              console.log(data);
          },
      );
  }

  const stopSensors = () =>{
      console.log("Stop Listening");
      SensorActivityModule?.stopSensors();
      subscription?.remove();
  }

    return (
        <View style={styles.view}>
            <Button title="Get Data" mb="2" style={styles.button} onPress={startAccelerometer}>Start accelerometer </Button>
            <Button title="Get Data" mb="2" style={styles.button} onPress={stopAccelerometer}>Stop accelerometer </Button>
            <Button title="Get Data" mb="2" style={styles.button} onPress={startSensors}>Start sensors </Button>
            <Button title="Get Data" mb="2" style={styles.button} onPress={stopSensors}>Stop sensors </Button>
        </View>
    )
}

export default TestSensorModulesScreen;