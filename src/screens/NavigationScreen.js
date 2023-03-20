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
import {StyleSheet} from 'react-native';
import {Box, Text, View, Image, Button, ChevronLeftIcon} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';

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
  input: {
    height: 50,
    borderWidth: 3,
    padding: 10,
    borderRadius: 4,
    borderColor: 'black',
  },
  boxCard: {
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
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

  useEffect(() => {
    const fetchBuildings = async () => {
      result = await getGPSData('get-nodes', 'getType=get-building-data');


      console.log("buildings received ", result);
      let building = []
      result.nodes.forEach(item => {
        building.push(item.buildingName);
      });

      setBuildings(building);
      setStepName('building');
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
    console.log("Building: " + selectedBuilding + " Floor: " + selectedFloor + " Current Location: " + startingNode + " Destination: " + dest );
    let response = await getGPSData('get-nodes', `getType=get-route&buildingName=${selectedBuilding}&floorName=${selectedFloor}&startingNode=${startingNode}&destination=${dest}`);
    
    // response returns an object with 3 items
    // the path (list of guids), the list of nodes, and the tts (list of guid:string pairs)
    // console.log("response: ",response);

    console.log("following is path, nodeList, and tts");

    let path = response?.path;
    let nodeList = response?.nodeList;
    let tts = response?.tts;

  //   let path = [
  //   "256f0bc4-1094-425f-9bb4-31f857d8f1d6",
  //   "c61b7a1c-9ece-4099-988e-fb09bc5da1cd",
  //   "83f5b26c-4288-410d-94dd-f146522e48b4",
  //   "135e4279-b350-41b2-8b2f-c0ed14d49dc1",
  //   "de9000fa-ae7d-46f7-84c3-aa625453f422",
  //   "6528052d-8415-4621-8323-b60a1b3dca5f",
  //   "78d110a1-ecbf-4026-a0fc-f82a7b34978f",
  //   "4790176d-dfaa-47a9-b149-37e30ec83f4a",
  //   "37683693-f389-4bc7-8ae4-0fff98d22038",
  //   "335efb30-c164-4773-a4b0-5312409db4ec"
  //   ];
  //   let nodeList = [
  //   {"adjacencyList": ["c61b7a1c-9ece-4099-988e-fb09bc5da1cd"],"guid": "256f0bc4-1094-425f-9bb4-31f857d8f1d6", "lat": 43.468826654943356, "long": -80.5418237144086, "name": "006", "type": "DestinationNodeState", "x": 40.430282940475905, "y": 54.93106918957069},
  //   {"adjacencyList": ["37683693-f389-4bc7-8ae4-0fff98d22038"], "guid": "335efb30-c164-4773-a4b0-5312409db4ec", "lat": 43.468961209193075, "long": -80.541707481051, "name": "116", "type": "DestinationNodeState", "x": 55.611202530856715, "y": 39.44856625919147},
  //   {"adjacencyList": ["83f5b26c-4288-410d-94dd-f146522e48b4", "256f0bc4-1094-425f-9bb4-31f857d8f1d6"], "guid": "c61b7a1c-9ece-4099-988e-fb09bc5da1cd", "lat": 43.46881944593198, "long": -80.54184154929825, "name": "", "type": "HallwayNodeState", "x": 38.60439781971296, "y": 54.50689265628873},
  //   {"adjacencyList": ["de9000fa-ae7d-46f7-84c3-aa625453f422", "83f5b26c-4288-410d-94dd-f146522e48b4"], "guid": "135e4279-b350-41b2-8b2f-c0ed14d49dc1", "lat": 43.46885260647477, "long": -80.54183844990739, "name": "", "type": "HallwayNodeState", "x": 40.117275495470665, "y": 47.93213090516649},
  //   {"adjacencyList": ["135e4279-b350-41b2-8b2f-c0ed14d49dc1", "c61b7a1c-9ece-4099-988e-fb09bc5da1cd"], "guid": "83f5b26c-4288-410d-94dd-f146522e48b4", "lat": 43.46884527265949, "long": -80.54184965275964, "name": "", "type": "HallwayNodeState", "x": 38.86523735721732, "y": 48.25026330512795},
  //   {"adjacencyList": ["6528052d-8415-4621-8323-b60a1b3dca5f", "135e4279-b350-41b2-8b2f-c0ed14d49dc1"], "guid": "de9000fa-ae7d-46f7-84c3-aa625453f422", "lat": 43.46886619195493, "long": -80.5418024225642, "name": "", "type": "HallwayNodeState", "x": 43.76904155788037, "y": 48.99257648591337},
  //   {"adjacencyList": ["78d110a1-ecbf-4026-a0fc-f82a7b34978f", "de9000fa-ae7d-46f7-84c3-aa625453f422"], "guid": "6528052d-8415-4621-8323-b60a1b3dca5f", "lat": 43.46889143648529, "long": -80.54175764832443, "name": "", "type": "HallwayNodeState", "x": 48.620673671926355, "y": 48.56839995263142},
  //   {"adjacencyList": ["4790176d-dfaa-47a9-b149-37e30ec83f4a", "6528052d-8415-4621-8323-b60a1b3dca5f"], "guid": "78d110a1-ecbf-4026-a0fc-f82a7b34978f", "lat": 43.46890945702616, "long": -80.54171993774287, "name": "", "type": "HallwayNodeState", "x": 52.58545135845749, "y": 48.88653235259287},
  //   {"adjacencyList": ["37683693-f389-4bc7-8ae4-0fff98d22038", "78d110a1-ecbf-4026-a0fc-f82a7b34978f"], "guid": "4790176d-dfaa-47a9-b149-37e30ec83f4a", "lat": 43.46892256941032, "long": -80.54169267777016, "name": "", "type": "HallwayNodeState", "x": 55.454698808354095, "y": 49.098620619233856},
  //   {"adjacencyList": ["4790176d-dfaa-47a9-b149-37e30ec83f4a", "335efb30-c164-4773-a4b0-5312409db4ec"], "guid": "37683693-f389-4bc7-8ae4-0fff98d22038", "lat": 43.46894191772329, "long": -80.54169560632637, "name": "", "type": "HallwayNodeState", "x": 55.92420997586196, "y": 44.75079416292586}
  // ];
    
  //   let tts = [
  //   ["256f0bc4-1094-425f-9bb4-31f857d8f1d6", "Starting Navigation"],
  //   ["256f0bc4-1094-425f-9bb4-31f857d8f1d6", "Now navigating to 116"],
  //   ["c61b7a1c-9ece-4099-988e-fb09bc5da1cd", "Turn right"],
  //   ["83f5b26c-4288-410d-94dd-f146522e48b4", "Turn right"],
  //   ["83f5b26c-4288-410d-94dd-f146522e48b4", "Go straight for 19 meters"],
  //   ["6528052d-8415-4621-8323-b60a1b3dca5f", "Turn left in 2 meters"],
  //   ["4790176d-dfaa-47a9-b149-37e30ec83f4a", "Turn left"],
  //   ["335efb30-c164-4773-a4b0-5312409db4ec", "You have arrived at 116"]
  // ];

    // console.log(path);

    // console.log(nodeList);

    // // tts = [{guid: "str to say"}, ...]

    // console.log(tts);
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
          alt="Logo of a person walking with a white cane."
        />
        <Text style={styles.title} fontSize="2xl">
          Accessibility
        </Text>
        <DistanceSensorComponent
            enableVibration={ENABLE_DISTANCE_SENSOR_VIBRATION}
            distanceLimit={DISTANCE_LIMIT}
            vibrationDuration={VIBRATION_DURATION}
            navigation={navigation}></DistanceSensorComponent>
        {stepName == 'building' ? (
          <ListItems list={buildings} updateStep={updateStep} titleText="building" />
        ): stepName == 'floor' ? (
          <ListItems list={floors} updateStep={updateStep} titleText="floor" />
        ): stepName == 'start' ? (
          <ListItems list={destinations} updateStep={updateStep} titleText="starting location" />
        ): stepName == 'destination' ? (
          <ListItems list={destinations} updateStep={updateStep} titleText="destination"/>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default NavigationScreen;
