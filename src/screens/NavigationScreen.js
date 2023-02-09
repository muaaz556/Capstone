import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import {NEXT_LABEL} from '../assets/locale/en';
import DistanceSensingComponent from '../components/atoms/distanceSensorComponent';
import {DISTANCE_LIMIT, ENABLE_DISTANCE_SENSOR_VIBRATION, 
        VIBRATION_DURATION} from '../assets/locale/en';

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
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

let result;
let currentNodeData;
const NavigationScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('building');
  const [floors, setFloors] = useState([])
  const [destinations, setDestinations] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [floorNameState, setFloorNameState] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("")
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(()  => {
    const fetchBuildings = async () => {
      result = await getGPSData('get-nodes', 'getType=get-building-data');

      let building = []
      result.nodes.forEach(item => {
        building.push(item.buildingName);
      });

      setBuildings(building);
    }
    fetchBuildings();
  }, []);

  const updateStep = async (itemName) => {
    if (stepName == 'building') {
      setSelectedBuilding(itemName)
      let currentFloors = []
      result.nodes.every(item => {
        if (item.buildingName == itemName){
          setFloors(item.floorNames)
          currentNodeData = item.destinationNodes;
          return false;
        }
        return true;
      });
      setStepName('floor');
    }
    else if (stepName == 'floor') {
      setFloorNameState(itemName)
      let currentDestNodes = [];

      let nodeName = []
      for (let i = 0; i < floors.length; i++ ) {
        if (floors[i] == itemName) {
          setDestinations(currentNodeData[i])
          break;
        }
      }
      setStepName('currentLocation');
    }
    else if (stepName == 'currentLocation') {
      setCurrentLocation(itemName);
      setStepName('destination');
    }
    else if (stepName == 'destination') {
      let buildingName = selectedBuilding;
      let floorName = floorNameState;
      let currentLoc = currentLocation;
      let dest = itemName;
      console.log("Building: " + buildingName + " Floor: " + floorName + " Current Location: " + currentLoc + " Destination: " + dest );
      let pathData = await getGPSData('get-nodes', `getType=get-route&buildingName=${buildingName}&floorName=${floorName}&currentLocation=${currentLoc}&destination=${dest}`);
      console.log(pathData);
      navigation.navigate('Login');
    }
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
        Accessibility
      </Text>

      <Box w="100%" maxWidth="75%" mt="5">
        <View style={styles.dividerView}>
          <View style={styles.dividerLine} />
          <View>
            <Text style={styles.dividerText}>Choose a building</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>
        <DistanceSensingComponent
        enableVibration={ENABLE_DISTANCE_SENSOR_VIBRATION}
        distanceLimit={DISTANCE_LIMIT}
        vibrationDuration={VIBRATION_DURATION}
        navigation={navigation}
        ></DistanceSensingComponent>
        {stepName == 'building' ? (
          <ListItems list={buildings} updateStep={updateStep} />
        ): stepName == 'floor' ? (
          <ListItems list={floors} updateStep={updateStep} />
        ): stepName == 'currentLocation' ? (
          <ListItems list={destinations} updateStep={updateStep} />
        ): stepName == 'destination' ? (
          <ListItems list={destinations} updateStep={updateStep} />
        ) : (
          <></>
        )}
      </Box>
    </View>
  );
};

export default NavigationScreen;
