// import React, {useContext, useEffect, useState} from 'react';
// import {StyleSheet, TextInput} from 'react-native';
// import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
// import {getGPSData} from '../helper-functions/gpsFetching';
// import ListItems from '../components/molecules/ListItems';
// import {NEXT_LABEL} from '../assets/locale/en';
import DistanceSensorComponent from '../components/organisms/DistanceSensorComponent';
import {
  DISTANCE_LIMIT,
  ENABLE_DISTANCE_SENSOR_VIBRATION,
  VIBRATION_DURATION,
} from '../assets/locale/en';
import React, { useEffect, useState } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, View, Image} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import Geolocation from 'react-native-geolocation-service';

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
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

let result;
let currentNodeData;
let stepCountOverall = 0;
let enableCount = false;
let distanceCountInMeters = 0;

let startPosition = null;
let endPosition = null;
let distance = null; //in feet
let numStepsForDistance = 10;
let stepSize = null; //in feet

const NavigationScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('');
  const [floors, setFloors] = useState([])
  const [destinations, setDestinations] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [selectedFloor, setSelectedFloor] = useState("");
  const [startingNode, setStartingNode] = useState("");

  useEffect(() => {
    // const fetchBuildings = async () => {
    //   result = await getGPSData('get-nodes', 'getType=get-building-data');


    //   console.log("buildings received ", result);
    //   let building = []
    //   result.nodes.forEach(item => {
    //     building.push(item.buildingName);
    //   });

    //   setBuildings(building);
    //   setStepName('building');
    // }
    // fetchBuildings();

    const config = {
      default_threshold: 10.0, //sensitivity lower is more sensative
      default_delay: 600000000, //0.6 sec interval between each step count
      cheatInterval: 3000,
      onStepCountChange: (stepCount) => { 
        // console.log("step count", stepCount) 
        if(enableCount){
          stepCountOverall = stepCountOverall + 1
          console.log(stepCountOverall)
          // distanceCountInMeters = distanceCountInMeters + 0.4572; //meters
          distanceCountInMeters = distanceCountInMeters + 1.5; //feet
          // distanceCountInMeters = distanceCountInMeters + stepSize; //calculated in feet
          console.log("distance:", distanceCountInMeters);
          // const start = {
          //   latitude: 43.41056100772335,
          //   longitude: -80.27945118444076
          // }
          
          // const end = {
          //   latitude: 43.41050255313412,
          //   longitude: -80.27954036788451
          // }
          
          // console.log(haversine(start, end, {unit: 'meter'}))
        }
      },
      onCheat: () => { console.log("User is Cheating") }
    }
    startCounter(config);
    return () => { stopCounter() }
  }, []);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        if(startPosition == null){
          startPosition = position;
        } else if(endPosition == null){
          endPosition = position
          const start = {
            latitude: startPosition.coords.latitude,
            longitude: startPosition.coords.longitude,
          }
          const end = {
            latitude: endPosition.coords.latitude,
            longitude: endPosition.coords.longitude,
          }
          distance = haversine(start, end, {unit: 'meter'})*3.281
          stepSize = distance/numStepsForDistance

          console.log("distance", start)
          console.log("stepSize", end)

          console.log("distance", distance)
          console.log("stepSize", stepSize)

          // console.log(haversine(start, end, {unit: 'meter'}))
        } else {
          console.log("already have all positions")
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
    );
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
        Accessibility
      </Text>
      <TouchableOpacity
        onPressIn={() => {enableCount = true}}
        onPressOut={() => {enableCount = false}}
      style={{height: 100, backgroundColor: 'red', width: 100}}>
         <Text>Press and hold to enable step counter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          stepCountOverall = 0; 
          distanceCountInMeters = 0;
          startPosition = null;
          endPosition = null;
          distance = null;
          stepSize = null
        }}
      style={{height: 100, backgroundColor: 'blue', width: 100, marginTop:30}}>
        <Text>Reset all items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          stepCountOverall = 0; 
          distanceCountInMeters = 0;
        }}
      style={{height: 100, backgroundColor: 'green', width: 100, marginTop:30}}>
        <Text>Reset steps</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {getCurrentPosition()}}
      style={{height: 100, backgroundColor: 'green', width: 100, marginTop:30}}>
        <Text>Get location</Text>
      </TouchableOpacity>
      {/* <DistanceSensorComponent
          enableVibration={ENABLE_DISTANCE_SENSOR_VIBRATION}
          distanceLimit={DISTANCE_LIMIT}
          vibrationDuration={VIBRATION_DURATION}
          navigation={navigation}></DistanceSensorComponent>
      {stepName == 'building' ? (
        <ListItems list={buildings} updateStep={updateStep} titleText="Choose a building" />
      ): stepName == 'floor' ? (
        <ListItems list={floors} updateStep={updateStep} titleText="Choose a floor" />
      ): stepName == 'start' ? (
        <ListItems list={destinations} updateStep={updateStep} titleText="Choose your starting location" />
      ): stepName == 'destination' ? (
        <ListItems list={destinations} updateStep={updateStep} titleText="Choose your final destination"/>
      ) : (
        <></>
      )} */}
    </View>
  );
};

export default NavigationScreen;
