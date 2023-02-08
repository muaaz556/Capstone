import React, { useEffect, useState } from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text, View, Image} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';

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
const NavigationScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('');
  const [floors, setFloors] = useState([])
  const [destinations, setDestinations] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [selectedFloor, setSelectedFloor] = useState("");
  const [startingNode, setStartingNode] = useState("");

  useEffect(()  => {
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

  const destination = async (dest) => {
    console.log("Building: " + selectedBuilding + " Floor: " + selectedFloor + " Current Location: " + startingNode + " Destination: " + dest );
    let response = await getGPSData('get-nodes', `getType=get-route&buildingName=${selectedBuilding}&floorName=${selectedFloor}&startingNode=${startingNode}&destination=${dest}`);
    
    // response returns an object with 3 items
    // the path (list of guids), the list of nodes, and the tts (list of guid:string pairs)
    console.log("response: ",response);

    let path = response?.path;
    let nodeList = response?.nodeList;
    let tts = response?.tts;

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
      )}
    </View>
  );
};

export default NavigationScreen;
