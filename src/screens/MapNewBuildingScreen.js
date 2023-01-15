import React from 'react';
import {useState} from 'react';

import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {getGPSData, postGPSData} from '../helper-functions/gpsFetching';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
});

const MapNewBuildingScreen = ({navigation}) => {
  const [stepNumber, setStepNumber] = useState(0);
  const [buildingName, setBuildingName] = useState('');

  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);

  const postCoordinates = () => {
    const requestData = JSON.stringify({
      gpsCornerCord: [
        {
          buildingName: buildingName,
          cornerCords: {
            cornerCords: [
              {long: longitude[0], lat: latitude[0]},
              {long: longitude[1], lat: latitude[1]},
              {long: longitude[2], lat: latitude[2]},
              {long: longitude[3], lat: latitude[3]},
            ],
          },
        },
      ],
    });

    postGPSData(requestData, 'post-corner-cords').then(() =>
      navigation.navigate('AccessibilityScreen'),
    );
  };

  return stepNumber === 0 ? (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Overview of mapping a building</Text>
      </Center>

      <Box w="100%" maxWidth="75%" mt="5">
        <Text numberOfLines={14}>
          The process of mapping a building starts with getting the coordinates
          of the four corners of the building from the outside. For example for
          the first corner you will go outside and stand by the first corner of
          the building then you can click the button to get the gps coordinate
          and it will be saved by the app. Next, you go to the second corner of
          the building and do the same thing.
        </Text>
        <Button mb="2" onPress={() => setStepNumber(1)}>
          Start
        </Button>
      </Box>
    </View>
  ) : stepNumber === 1 ? (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Enter the name of the building</Text>
      </Center>

      <TextInput
        style={styles.input}
        onChangeText={e => setBuildingName(e)}
        value={buildingName}
      />
      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="2"
          onPress={() => {
            setStepNumber(2);
          }}>
          Next
        </Button>
      </Box>
    </View>
  ) : stepNumber === 2 ? (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Corner {latitude.length + 1}</Text>
      </Center>

      <Box w="100%" maxWidth="75%" mt="5">
        <Text numberOfLines={14}>
          Go to corner {latitude.length + 1} of the building and hit get
          coordinate.
        </Text>
        <Button
          mb="2"
          onPress={() => {
            Geolocation.getCurrentPosition(
              position => {
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
                setLatitude(latitude => [
                  ...latitude,
                  position.coords.latitude,
                ]);
                setLongitude(longitude => [
                  ...longitude,
                  position.coords.longitude,
                ]);
                setStepNumber(4);
              },
              error => {
                console.log(error.code, error.message);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
            setStepNumber(3);
          }}>
          Get Coordinate
        </Button>
      </Box>
    </View>
  ) : stepNumber === 3 ? (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Please wait</Text>
      </Center>
    </View>
  ) : stepNumber === 4 ? (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">
          Coordinate Received for Corner {latitude.length}
        </Text>
      </Center>
      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="2"
          onPress={() => {
            if (latitude.length === 4) {
              postCoordinates();
            } else {
              setStepNumber(2);
            }
          }}>
          {latitude.length === 4 ? 'Next Step' : 'Get Next Coordinate'}
        </Button>
        {latitude.length === 4 && (
          <Button
            mb="2"
            onPress={() => {
              setStepNumber(2);
              setLatitude([]);
              setLongitude([]);
            }}>
            Redo Coordinates
          </Button>
        )}
      </Box>
    </View>
  ) : null;
};

export default MapNewBuildingScreen;
