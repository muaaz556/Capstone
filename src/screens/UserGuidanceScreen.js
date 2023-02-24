import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Center, Text, View, Image} from 'native-base';
import Tts from 'react-native-tts';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
const haversine = require('haversine')
import CompassHeading from 'react-native-compass-heading';
import { NativeModules, NativeEventEmitter } from 'react-native';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
    marginBottom: '0%',
  },
  logoImage: {
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  dividerText: {
    textAlign: 'center',
    color: '#808585',
    paddingHorizontal: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#808585',
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#808585',
    color: '#000000',
  },
  boxCard: {
    backgroundColor: '#DEDEDE',
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
  },
});


const {AccelerometerSensorModule, GyroscopeSensorModule, SensorActivityModule} = NativeModules;
let subscription = null;
let subscription2 = null;

let pathIndex = 0;
let ttsIndex = 0;

let stepCountOverall = 0;
let enableCount = false;
let distanceCountInFeet = 0;
let stepSize = 1.5; //in feet
let targetDistance = null;

let targetBear = null;
let currentBear = null;

let time = new Date().getTime();
let timeInterval = 0.1;

let prevAccelData = { x: 0, y: 0, z: 0 };
let prevVelocity = { x: 0, y: 0, z: 0 };
let prevDistance = { x: 0, y: 0, z: 0 };
let velocity = { x: 0, y: 0, z: 0 };
let distance = { x: 0, y: 0, z: 0 };

const UserGuidanceScreen = ({route, navigation}) => {

    const [stepName, setStepName] = useState('');
    const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
    const [angles, setAngles] = useState({ azimuth: 0, pitch: 0, roll: 0 })
    const [adjustedDistance, setAdjustedDistance] = useState({lat: 0, long: 0});
    
    useEffect(() => {
      startSensors();
      startAccelerometer();

      const degree_update_rate = 3;
      CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
        console.log('CompassHeading: ', heading, accuracy);
        currentBear = heading;

        console.log(route.params.path)
        if(targetDistance == null){
          findTargetDistance();
          checkTTS();
          pathIndex++;
        }
        setStepName('start');
        CompassHeading.stop(); 
      });
      

      const config = {
        default_threshold: 10.0, //sensitivity lower is more sensative
        default_delay: 600000000, //0.6 sec interval between each step count
        onStepCountChange: (stepCount) => { 
          if(enableCount){
            stepCountOverall = stepCountOverall + 1
            console.log(stepCountOverall)
            distanceCountInFeet = distanceCountInFeet + stepSize; // in feet
            console.log("distance:", distanceCountInFeet);

            if(targetDistance == null || targetDistance <= distanceCountInFeet) {
              if(pathIndex < route.params.nodeList.length - 1){
                findTargetDistance();
                checkTTS();
                pathIndex++;
              } else {
                checkTTS();
                enableCount = false;
                distanceCountInFeet = 0;
                stepCountOverall = 0;
                targetDistance = null;
                setStepName('Done');
              }
            }

          }
        },
      }
      startCounter(config);

      
      return () => { 
        stopCounter(); 
        CompassHeading.stop(); 
      }
    }, []);

    useEffect(() => {
      const calculateDistance = () => {
        const currTime = new Date().getTime();
        const deltaTime = (currTime - time) / 1000; // convert to seconds
        time = currTime;
  
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
        velocity = newVelocity;
  
        const newDistance = {
          x: calculateDistanceFromVelocity((velocity.x + prevVelocity.x) / 2, prevDistance.x),
          y: calculateDistanceFromVelocity((velocity.y + prevVelocity.y) / 2, prevDistance.y),
          z: calculateDistanceFromVelocity((velocity.z + prevVelocity.z) / 2, prevDistance.z)
        };
        distance = newDistance;
        // console.log("this is the new distance: ", newDistance);
        // console.log("angles are: ", angles);
  
        prevAccelData = accelData;
        prevVelocity = newVelocity;
        prevDistance = newDistance;
      };
  
      const intervalId = setInterval(calculateDistance, timeInterval * 1000);
      return () => clearInterval(intervalId);
    }, [accelData]);

    useEffect(() => {
      const azimuthRad = toRadians(angles.azimuth);
      const pitchRad = toRadians(angles.pitch);
      const rollRad = toRadians(angles.roll);

      const R_azimuth = [
        [Math.cos(azimuthRad), -Math.sin(azimuthRad), 0],
        [Math.sin(azimuthRad), Math.cos(azimuthRad), 0],
        [0,0,1],
      ]

      const R_roll = [
        [1,0,0],
        [0,Math.cos(rollRad), -Math.sin(rollRad)],
        [0,Math.sin(rollRad), Math.cos(rollRad)],
      ]

      const R_roll = [
        [Math.cos(pitchRad), 0, Math.sin(pitchRad)],
        [0,1,0]
        [-Math.sin(pitchRad), 0, Math.cos(pitchRad)],
      ]

    }, [accelData, angles]);

    const findTargetDistance = () => {
      let startNode = null
      let endNode = null

      for (let i = 0; i < route.params.nodeList.length; i++) {
        if(route.params.nodeList[i]['guid'] === route.params.path[pathIndex]) {
          startNode = route.params.nodeList[i];
        } else if (route.params.nodeList[i]['guid'] === route.params.path[pathIndex + 1]){
          endNode = route.params.nodeList[i];
        }
      }
      targetDistance = coordinateDistance(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']);
      targetBear = bearing(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']);
      getShortestTurn(currentBear, targetBear)
      console.log("***!!!! target distance is", targetDistance)
      console.log("Calculated bearing", bearing(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']))
      distanceCountInFeet = 0;
      stepCountOverall = 0;
    };


    // Converts from degrees to radians.
    function toRadians(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    function toDegrees(radians) {
      return radians * 180 / Math.PI;
    }

    // source: https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
    function bearing(startLat, startLng, destLat, destLng){
      startLat = toRadians(startLat);
      startLng = toRadians(startLng);
      destLat = toRadians(destLat);
      destLng = toRadians(destLng);

      y = Math.sin(destLng - startLng) * Math.cos(destLat);
      x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
      brng = Math.atan2(y, x);
      brng = toDegrees(brng);
      return (brng + 360) % 360;
    }

    function getShortestTurn(currentBearing, targetBearing){
      console.log("bearings", currentBearing, targetBearing)
      // source: https://math.stackexchange.com/questions/110080/shortest-way-to-achieve-target-angle
      turn = ((targetBearing - currentBearing + 540) % 360) - 180
      turn = Number(turn.toFixed(0))
      console.log("calculated turn" , turn)
      if(turn >= 0){
        Tts.speak("Turn right " + Math.abs(turn) + " degrees");
      } else {
        Tts.speak("Turn left " + Math.abs(turn) + " degrees");
      }
    }
  
    const coordinateDistance = (x1, y1, x2, y2) => {
      const start = {
        latitude: x1,
        longitude: y1,
      }
      const end = {
        latitude: x2,
        longitude: y2,
      }
      return haversine(start, end, {unit: 'meter'})*3.281 // coverts from meters to feet
    };

    const checkTTS = () => {
      let guid = route.params.path[pathIndex];

      while(ttsIndex < route.params.tts.length && route.params.tts[ttsIndex][0] == guid) {
        Tts.speak(route.params.tts[ttsIndex][1]);
        ttsIndex++;
      }
    };


    const startAccelerometer = () => {
      // SensorEventModule.printTemp();
      console.log("r u working accelerometer")
      AccelerometerSensorModule?.startAccelerationSensor();

      const eventEmitter = new NativeEventEmitter();

      subscription = eventEmitter.addListener(
          'AccelerometerModule',
          (data) => {
              // testing to see if we can see the values of accelerometer
              // console.log(data);
              setAccelData(data)
          },
      );
    }

    const stopAccelerometer = () => {
      console.log("Stop Listening");
      AccelerometerSensorModule?.stopAccelerationSensor();
      subscription?.remove();
    }

    const startSensors = () => {
      // SensorEventModule.printTemp();
      console.log("r u working SensorActivityModule")
      SensorActivityModule?.startSensors();

      const eventEmitter = new NativeEventEmitter();

      subscription2 = eventEmitter.addListener(
          'SensorActivityModule',
          (data) => {
              // testing to see if we can see the values of SensorActivityModule
              setAngles(data)
              console.log(data);
          },
      );
    }

    const stopSensors = () =>{
      console.log("Stop Listening");
      SensorActivityModule?.stopSensors();
      subscription2?.remove();
    }

    const matrixMultiplication = (matrixA, matrixB) => {
      const result = [];
      for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < matrixB.length; k++) {
            sum += matrixA[i][k] * matrixB[k][j];
          }
          result[i][j] = sum;
        }
      }
      return result;
    };
  
    const matrixVectorMultiplication = (matrix, vector) => {
      const result = [];
      for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < vector.length; j++) {
          sum += matrix[i][j] * vector[j];
        }
        result[i] = sum;
      }
      return result;
    };
  
    return (
      <View style={styles.view}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/splashscreen_logo.png')}
          size="lg"
          alt="Logo image"
        />
        <Text style={styles.title} fontSize="2xl">
          User Guidance Screen
        </Text>
        {stepName == 'start' ? (
          <View maxHeight="65%">
            <TouchableOpacity
              onPressIn={() => {enableCount = true}}
              onPressOut={() => {enableCount = false}}
              style={{height: 100, backgroundColor: 'red', width: 100}}>
              <Text>Press and hold to enable step counter</Text>
            </TouchableOpacity>
          </View>
        ) : stepName == 'Done' ? (
          <Button
            title="Stop"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Go back to Login</Text>
          </Button>
        ) : (
          <></>
        )}
      </View>
    );

};

export default UserGuidanceScreen;

