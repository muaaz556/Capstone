import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Center, Text, View, Image} from 'native-base';
import Tts from 'react-native-tts';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
const haversine = require('haversine')
import CompassHeading from 'react-native-compass-heading';
import { StackActions } from '@react-navigation/native';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 50,
    width: '70%',
    height: 200,
    // padding: 0,
    justifyContent: 'center',
    backgroundColor: '#005AB5',
    borderRadius: 14,
    margin: 20
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
    fontWeight: '600',
    textAlign:"center",
    fontSize: 22,
    padding: 60
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
  goodBadButton: {
    margin: 20,
    backgroundColor: '#005AB5',

  },
  goodBadButtonText: {
    margin: 20,
    color: 'white',
    fontSize: 20
  }
});

let pathIndex = 0;
let ttsIndex = 0;

let stepCountOverall = 0;
let enableCount = false;
let distanceCount = 0;
let stepSize = 0.75 //0.5; //in meters (this is 1.5 feet)
let targetDistance = null;

// let targetBear = null;
// let currentBear = null;

let checkState = false;

const UserGuidanceScreen = ({route, navigation}) => {

    const [stepName, setStepName] = useState('');
    const [enableCountUI, setEnableCountUI] = useState(false);

    // const [currentHeading, setCurrentHeading] = useState(0);
    // const [targetHeading, setTargetHeading] = useState(0);
    const [checkContinue, setCheckContinue] = useState(true);

    // useEffect(() => {
    //   if (!checkContinue) {
    //     checkTTS();
    //     pathIndex++;
    //     setStepName('start');
    //   }
    // }, [checkContinue]);
    
    // useEffect(() => {
    //   const degree_update_rate = 3;
  
    //   CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
    //     currentBear = heading;
    //     setCurrentHeading(heading);
    //     if (checkState) {
    //       console.log(checkState, " ", heading, " ", targetHeading, " ", targetBear);
    //       if (heading >= targetBear - 5 && heading <= targetBear + 5) {
    //         checkState = false;
    //         Tts.speak("Stop");
    //         Tts.speak("Please hold your phone vertically");
    //         setCheckContinue(false);
    //       }
    //     }
    //   });
  
    //   return () => {
    //     CompassHeading.stop();
    //   };
    // }, []);

    useEffect(() => {
      resetAllVariables();
      

      if(targetDistance == null){
        findTargetDistance();
      }
      checkTTS();
      pathIndex++;
      setStepName('start');
      
      const config = {
        default_threshold: 10.0, //sensitivity, lower is more sensative
        default_delay: 600000000, //0.6 sec interval between each step count
        onStepCountChange: (stepCount) => { 
          if(enableCount){
            rand_step = (Math.random() * (0.2000 - 0.3000) + 0.3000).toFixed(4);
            console.log(rand_step);
            stepCountOverall = stepCountOverall + 1 + parseFloat(rand_step);
            console.log("steps counted:", stepCountOverall)
            distanceCount = distanceCount + stepSize + 0.5*rand_step; // in feet
            console.log("distance counted:", distanceCount);

            if(targetDistance == null || targetDistance <= distanceCount) {
              if(pathIndex < route.params.path.length - 1){
                findTargetDistance();
                console.log("Over here now");
                checkTTS();
                pathIndex++;
              } else {
                console.log("Over over here");
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
      }
    }, []);

    const resetAllVariables = () => {
      // setEnableCount(false);
      enableCount = false;
      distanceCount = 0;
      stepCountOverall = 0;
      targetDistance = null;
      // targetBear = null;
      // currentBear = null;
      pathIndex = 0;
      ttsIndex = 0;
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
      targetDistance = distance(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']);
      console.log("\nTarget distance:", targetDistance)
      console.log("Start Node: ", startNode['lat'], ", ", startNode['long']);
      console.log("End Node: ", endNode['lat'], ", ", endNode['long']);

      // if(pathIndex == 0){
      //   targetBear = bearing(startNode['lat'], startNode['long'], endNode['lat'], endNode['long']);
      //   setTargetHeading(targetBear);
      //   getShortestTurn(currentBear, targetBear)
      // }
      
      distanceCount = 0;
      stepCountOverall = 0;
    };

    // source: https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
    // Converts from degrees to radians.
    // function toRadians(degrees) {
    //   return degrees * Math.PI / 180;
    // };
    
    // source: https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
    // Converts from radians to degrees.
    // function toDegrees(radians) {
    //   return radians * 180 / Math.PI;
    // }

    // source: https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
    // function bearing(startLat, startLng, destLat, destLng){
    //   startLat = toRadians(startLat);
    //   startLng = toRadians(startLng);
    //   destLat = toRadians(destLat);
    //   destLng = toRadians(destLng);

    //   y = Math.sin(destLng - startLng) * Math.cos(destLat);
    //   x = Math.cos(startLat) * Math.sin(destLat) -
    //         Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    //   brng = Math.atan2(y, x);
    //   brng = toDegrees(brng);
    //   return (brng + 360) % 360;
    // }

    // function getShortestTurn(currentBearing, targetBearing){
    //   console.log("Current bearing:", currentBearing, "Target bearing:", targetBearing)

    //   // source: https://math.stackexchange.com/questions/110080/shortest-way-to-achieve-target-angle
    //   turn = ((targetBearing - currentBearing + 540) % 360) - 180
    //   turn = Number(turn.toFixed(0))

    //   Tts.speak("Please hold your phone horizontally");

    //   setTimeout(() => {
    //     if (turn >= 0) {
    //       Tts.speak("Turn to your right and continue turning until you hear stop");
    //     } else {
    //       Tts.speak("Turn to your left and continue turning until you hear stop.")
    //     }
  
    //     checkState = true;
    //   }, 8000);
    // }
  
    const distance = (x1, y1, x2, y2) => {
      const start = {
        latitude: x1,
        longitude: y1,
      }
      const end = {
        latitude: x2,
        longitude: y2,
      }
      return haversine(start, end, {unit: 'meter'})
    };

    const checkTTS = () => {
      let guid = route.params.path[pathIndex];

      while(ttsIndex < route.params.tts.length && route.params.tts[ttsIndex][0] == guid) {
        console.log(route.params.tts[ttsIndex][1])
        Tts.speak(route.params.tts[ttsIndex][1]);
        ttsIndex++;
      }
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
        {/* <Text>Current Heading: {currentHeading}</Text>
        <Text>Target Heading: {targetHeading}</Text> */}
        {stepName == 'start' ? (
          <View maxHeight="65%">
            <TouchableOpacity
              onPress={() => {
                if(enableCountUI == true){
                  setEnableCountUI(false)
                  enableCount = false
                } else {
                  setEnableCountUI(true)
                  enableCount = true
                }
                console.log(enableCount)
              }}
              style={styles.button}>
                {(enableCountUI)? 
                  <Text style={styles.buttonText}>Pause Navigation</Text>:
                  <Text style={styles.buttonText}>Start Navigation</Text>
                }
            </TouchableOpacity>
          </View>
        ) : stepName == 'Done' ? (
          <>
          <Text style={styles.title}>
            How was user guidance?
          </Text>
          <View style={{ flexDirection:"row" }}>
              <View >
                  <Button style={styles.goodBadButton} size="lg" onPress={() => {
                navigation.dispatch(StackActions.popToTop())
              }
            }><Text style={styles.goodBadButtonText}>Good</Text></Button>
              </View>
              <View >
                  <Button style={styles.goodBadButton} size="lg" onPress={() => {
                navigation.dispatch(StackActions.popToTop())
              }
            }><Text style={styles.goodBadButtonText}>Bad</Text></Button>
              </View>
          </View>
          </>
        ) : (
          <></>
        )}
      </View>
    );

};

export default UserGuidanceScreen;

