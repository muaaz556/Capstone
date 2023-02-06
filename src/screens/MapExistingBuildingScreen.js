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
      let buildingName = selectedBuilding;
      let floorName = itemName;
      navigation.navigate('FloorMappingScreen', {buildingName, floorName});
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
        <View style={styles.dividerView}>
          <View style={styles.dividerLine} />
          <View>
            <Text style={styles.dividerText}>Choose a building</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>
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
                        {item}
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
                mb="2"
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
