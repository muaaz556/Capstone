import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
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
});
let result;
const MapExistingBuildingScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('building');
  const [floors, setFloors] = useState([])
  const [selectedBuilding, setselectedBuilding] = useState("")

  useEffect(()  => {
    const fetchBuildings = async () => {
      result = await getGPSData('get-nodes');

      let buildingArray = []
      result.nodes.forEach(item => {
        buildingArray.append(item.buildingName);
      });

      setBuildings(buildingArray);
    }
    fetchBuildings();
  }, []);

  const updateStep = (itemName) => {
    if (stepName == 'building') {
      setselectedBuilding(itemName)
      result.nodes.forEach(item => {
        if (item.buildingName == itemName){
          setFloors(item.floorName);
        }
      });
      setStepName('floor');
    }
    else if (stepName == 'floor') {
      navigation.navigate('FloorMappingScreen', {selectedBuilding, itemName});
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
        {stepName == 'building' ? (
          <ListItems list={buildings} updateStep={updateStep}/>
        ): stepName == 'floor' ? (
          <ListItems list={floors} updateStep={updateStep}/>
        ) : (
          <></>
        )}
        {/* <FlatList
          data={buildings}
          renderItem={({item}) => (
              <>
                  <Button
                      title={item.buildingName}
                      style={styles.button}
                      >
                      {item.buildingName}
                  </Button>
              </>
          )}
        /> */}
      </Box>
    </View>
  );
};

export default MapExistingBuildingScreen;
