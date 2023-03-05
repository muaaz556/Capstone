import React, { useEffect, useState } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Text, View, Image, FlatList} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import {NEXT_LABEL} from '../assets/locale/en';

const styles = StyleSheet.create({
  view: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    backgroundColor: '#005AB5',
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
    marginBottom: '5%',
  },
  logoImage: {
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  dividerText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#808585',
  },
  input: {
    height: 50,
    borderWidth: 3,
    padding: 10,
    borderRadius: 14,
    borderColor: 'black',
  },
  boxCard: {
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
  },
});

let result;
const MapExistingBuildingScreen = ({navigation}) => {
  const [buildings, setBuildings] = useState([])
  const [stepName, setStepName] = useState('building');
  const [floors, setFloors] = useState([])
  const [selectedBuilding, setselectedBuilding] = useState("")
  const [floorNameState, setFloorNameState] = useState("");

  useEffect(()  => {
    const fetchBuildings = async () => {
      result = await getGPSData('get-nodes', 'getType=get-buildings');

      let buildingArray = []
      result.nodes.forEach(item => {
        buildingArray.push(item.buildingName);
      });

      setBuildings(buildingArray);
    }
    fetchBuildings();
  }, []);

  const updateStep = async (itemName) => {
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
      let buildingName = selectedBuilding;
      let getCornerGPSCoords = await getGPSData('get-corner-cords', `getType=get-route&buildingName=${buildingName}`);
      let numOfCorners = getCornerGPSCoords.cornerCords.length;
      let floorName = itemName;
      navigation.navigate('FloorMappingScreen', {buildingName, floorName, numOfCorners});
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
        </Box>
        {stepName == 'building' ? (
          <View maxHeight="65%">
            <FlatList
            data={buildings}
            renderItem={({item}) => (
                <>
                    <Button
                    title={item}
                    style={styles.button}
                    onPress={()=> updateStep(item)}>
                      <Text style={styles.buttonText}>{item}</Text>
                    </Button>
                </>
            )}
            />
          </View>
        ): stepName == 'floor' ? (
          <>
            <Box w="100%" maxWidth="90%" mt="5" style={styles.boxCard}>
                <TextInput
                  style={styles.input}
                  onChangeText={e => setFloorNameState(e)}
                  value={floorNameState}
                  placeholder="Floor name"
                  placeholderTextColor="#808585"
                />
            </Box>
            <Box w="100%" maxWidth="75%" mt="5">
              <Button
                style={styles.button}
                onPress={() => {
                  updateStep(floorNameState);
                }}>
                <Text style={styles.buttonText}>{NEXT_LABEL}</Text>
              </Button>
            </Box>
          </>
        ) : (
          <></>
        )}
    </View>
  );
};

export default MapExistingBuildingScreen;
