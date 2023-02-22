import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Center, Text, View, Image} from 'native-base';
import Tts from 'react-native-tts';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
const haversine = require('haversine')

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

let pathIndex = 0;
let ttsIndex = 0;

let stepCountOverall = 0;
let enableCount = false;
let distanceCountInFeet = 0;
let stepSize = 1.5; //in feet
let targetDistance = null;

const UserGuidanceScreen = ({route, navigation}) => {

    const [stepName, setStepName] = useState('');
    
    useEffect(() => {
      console.log(route.params.path)
      if(targetDistance == null){
        findTargetDistance();
        checkTTS();
        pathIndex++;
      }
      setStepName('start');

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
                setStepName('Done');
              }
            }

          }
        },
      }
      startCounter(config);
      return () => { stopCounter() }
    }, []);

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
      console.log("target distance is", targetDistance)
      distanceCountInFeet = 0;
      stepCountOverall = 0;
    };
  
    const distance = (x1, y1, x2, y2) => {
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

