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
import {ActivityIndicator, StyleSheet, ScrollView} from 'react-native';
import {Box, Text, View, Image, Button, ChevronLeftIcon} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import Tts from 'react-native-tts';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  backButton: {
    padding: 20,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#005AB5',
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
    marginBottom: '0%',
  },
  logoImage: {
    marginTop: '20%',
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    // marginBottom: 0,
    // marginHorizontal: 30,
    maxWidth: '75%'
  },
  dividerText: {
      textAlign: 'center',
      color: 'black',
      paddingHorizontal: 10,
  },
  dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: 'black',
  },
  scrollViewStyle: { 
    flexGrow: 1, 
    alignItems: 'center',
    // justifyContent: 'center'
  }, 
  container: {
    flex: 0.5,
    justifyContent: 'center',
  },
});

let result;
let currentNodeData;
const NavigationScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('');
  const [floors, setFloors] = useState([])
  const [destinations, setDestinations] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [selectedFloor, setSelectedFloor] = useState("");
  const [startingNode, setStartingNode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      setLoading(true);
      result = await getGPSData('get-nodes', 'getType=get-building-data');


      console.log("buildings received ", result);
      let building = []
      result.nodes.forEach(item => {
        building.push(item.buildingName);
      });

      setBuildings(building);
      setStepName('building');
      setLoading(false);
    }
    fetchBuildings();
  }, []);

  const building = (selectedItem) => {
    setSelectedBuilding(selectedItem)
    result.nodes.every(item => {
      if (item.buildingName == selectedItem){
        setFloors(item.floorNames)
        currentNodeData = item.destinationNodes;
        return false;
      }
      return true;
    });
    setStepName('floor');
  }

  const floor = (selectedItem) => {
    setSelectedFloor(selectedItem)
    for (let i = 0; i < floors.length; i++ ) {
      if (floors[i] == selectedItem) {
        setDestinations(currentNodeData[i])
        break;
      }
    }
    setStepName('start');
  }

  const start = (selectedItem) => {
    setStartingNode(selectedItem);
    setStepName('destination');
  }

  const navigateBack = () =>{
    switch(stepName) {
      case 'building':
        navigation.navigate('Login');
        break;
      case 'floor':
        setStepName('building');
        break;
      case 'start':
        setStepName('floor');
        break;
      case 'destination':
        setStepName('start');
        break;
    }
  }

  const destination = async (dest) => {
    setLoading(true);
    console.log("Building: " + selectedBuilding + " Floor: " + selectedFloor + " Current Location: " + startingNode + " Destination: " + dest );
    let response = await getGPSData('get-nodes', `getType=get-route&buildingName=${selectedBuilding}&floorName=${selectedFloor}&startingNode=${startingNode}&destination=${dest}`);
    

    console.log("following is path, nodeList, and tts");

    let path = response?.path;
    let nodeList = response?.nodeList;
    let tts = response?.tts;

    console.log("navigation screen ending");

    navigation.navigate('UserGuidanceScreen', {path, nodeList, tts});
  }

  const updateStep = (selectedItem) => {
    switch(stepName) {
      case 'building':
        building(selectedItem);
        break;
      case 'floor':
        floor(selectedItem);
        break;
      case 'start':
        start(selectedItem);
        break;
      case 'destination':
        destination(selectedItem);
        break;
    }
  };

  return (
    <>
      <ChevronLeftIcon
      style={styles.backButton}
      accessible={true}
      accessibilityHint="Select this button to go back"
      accessibilityLabel="Back Button"
      accessibilityRole="button"
      onPress={navigateBack}
      color="white" />
      <View style={styles.view}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/splashscreen_logo.png')}
          size="lg"
          alt="Logo of a person walking with a white guide cane."
        />
        <Text style={styles.title} fontSize="2xl">
          Student Navigation
        </Text>
        <DistanceSensorComponent
            enableVibration={ENABLE_DISTANCE_SENSOR_VIBRATION}
            distanceLimit={DISTANCE_LIMIT}
            vibrationDuration={VIBRATION_DURATION}
            navigation={navigation}/>

        {loading ? (
          <ActivityIndicator size={100} color='#005AB5' style={[styles.container]}/>
        ) : (
          stepName == 'building' ? (
            <>
            <View style={styles.dividerView}>
                <View style={styles.dividerLine} />
                <View>
                    <Text style={styles.dividerText}>Choose a building</Text>
                </View>
                <View style={styles.dividerLine} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewStyle}>
              <ListItems list={buildings} updateStep={updateStep} titleText="building" />
            </ScrollView>
            </>
          ): stepName == 'floor' ? (
            <>
            <View style={styles.dividerView}>
                <View style={styles.dividerLine} />
                <View>
                    <Text style={styles.dividerText}>Choose a floor</Text>
                </View>
                <View style={styles.dividerLine} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewStyle}>
            <ListItems list={floors} updateStep={updateStep} titleText="floor" />
            </ScrollView>
            </>
          ): stepName == 'start' ? (
            <>
              <View style={styles.dividerView}>
                  <View style={styles.dividerLine} />
                    <View>
                        <Text style={styles.dividerText}>Choose a starting location</Text>
                    </View>
                  <View style={styles.dividerLine} />
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewStyle}>
                <ListItems list={destinations} updateStep={updateStep} titleText="starting location" />
              </ScrollView>
            </>
          ): stepName == 'destination' ? (
            <>
              <View style={styles.dividerView}>
                  <View style={styles.dividerLine} />
                    <View>
                        <Text style={styles.dividerText}>Choose a destination</Text>
                    </View>
                  <View style={styles.dividerLine} />
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewStyle}>
                <ListItems list={destinations.filter(dest => dest !== startingNode)} updateStep={updateStep} titleText="destination"/>
              </ScrollView>
            </>
          ) : (
            <></>
          )
        )}
      </View>
    </>
  );
};

export default NavigationScreen;
