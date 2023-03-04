import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Center, Text, View, Image} from 'native-base';
import Tts from 'react-native-tts';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
const haversine = require('haversine')
import CompassHeading from 'react-native-compass-heading';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { StackActions } from '@react-navigation/native';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 50,
    width: '60%',
    height: '60%',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#2298b3',
    borderRadius: 14,
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
    textAlign:"center",
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
let distanceCount = 0;
let stepSize = 0.4572; //in meters (this is 1.5 feet)
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
let startLocation = {lat: 0, long: 0};
let moving = false;

const UserGuidanceScreen = ({route, navigation}) => {

    const [stepName, setStepName] = useState('');
    const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
    const [adjustedDistance, setAdjustedDistance] = useState({lat: 0, long: 0});
    
    useEffect(() => {
      // startSensors();
      startAccelerometer();
      resetAllVariables();

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
            console.log("steps counted:", stepCountOverall)
            distanceCount = distanceCount + stepSize; // in feet
            console.log("distance counted:", distanceCount);

            averagedDistance = (distanceCount + math.abs(distance.z))/2;

            if(targetDistance == null || targetDistance <= averagedDistance) {
              if(pathIndex < route.params.nodeList.length - 1){
                findTargetDistance();
                checkTTS();
                pathIndex++;
              } else {
                checkTTS();
                resetAllVariables();
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
    
    const resetAllVariables = () => {
      enableCount = false;
      distanceCount = 0;
      stepCountOverall = 0;
      targetDistance = null;
      targetBear = null;
      currentBear = null;
      pathIndex = 0;
      ttsIndex = 0;
    }

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
        areWeMoving();
  
        const newDistance = {
          x: calculateDistanceFromVelocity((velocity.x + prevVelocity.x) / 2, prevDistance.x),
          y: calculateDistanceFromVelocity((velocity.y + prevVelocity.y) / 2, prevDistance.y),
          z: calculateDistanceFromVelocity((velocity.z + prevVelocity.z) / 2, prevDistance.z)
        };
        distance = newDistance;
        calcAdjDistance();

  
        prevAccelData = accelData;
        prevVelocity = newVelocity;
        prevDistance = newDistance;
      };
  
      const intervalId = setInterval(calculateDistance, timeInterval * 1000);
      return () => clearInterval(intervalId);
    }, [accelData]);

    const areWeMoving = () => {
      moving = math.abs(velocity.z) > 1;
    }

    const calcAdjDistance = () => {

    }

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
      console.log("Target distance:", targetDistance)

      if(pathIndex == 0){
        targetBear = bearing(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']);
        getShortestTurn(currentBear, targetBear)
      }

      distanceCount = 0;
      stepCountOverall = 0;
      distance = {x: 0, y: 0, z: 0};
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
      return haversine(start, end, {unit: 'meter'});
    };

    const checkTTS = () => {
      let guid = route.params.path[pathIndex];

      while(ttsIndex < route.params.tts.length && route.params.tts[ttsIndex][0] == guid) {
        Tts.speak(route.params.tts[ttsIndex][1]);
        ttsIndex++;
      }
    };


    const startAccelerometer = () => {
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
              style={styles.button}>
              <Text style={styles.buttonText}>Press and hold to enable step counter</Text>
            </TouchableOpacity>
          </View>
        ) : stepName == 'Done' ? (
          <Button
            title="Stop"
            style={styles.button}
            onPress={() => {
                stopAccelerometer()
                navigation.dispatch(StackActions.popToTop())
              }
            }>
              <Text style={styles.buttonText}>Go back to Login</Text>
          </Button>
        ) : (
          <></>
        )}
      </View>
    );

};

export default UserGuidanceScreen;

