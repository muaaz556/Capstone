import React from 'react';
import {useState} from 'react';

import {ActivityIndicator, StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {getGPSData, postGPSData} from '../helper-functions/gpsFetching';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  pleaseWait: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
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
      navigation.navigate('FloorMappingScreen'),
    );
  };

  return stepNumber === 0 ? (
    <View style={styles.view}>
      <Center>
        <Text style={styles.title} fontSize="2xl">
          Overview of Mapping a Building
        </Text>
      </Center>

      <Box w="100%" maxWidth="90%" mt="5">
        <Text numberOfLines={14} styles={styles.overview}>
          To map a building you will complete the following steps:{'\n'}- Go to
          each corner of the building from the outside and then press the "Get
          GPS Location" button to get the current GPS location{'\n'}- Upload the
          building map and then label the corners you visited in the first step
          on the map{'\n'}- Label paths and locations in the building map which
          will be used to navigate{'\n'}
        </Text>
      </Box>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button mb="2" onPress={() => setStepNumber(1)}>
          Start
        </Button>
      </Box>
    </View>
  ) : stepNumber === 1 ? (
    <View style={styles.view}>
      <Center>
        <Text style={styles.title} fontSize="2xl">
          Enter the Name of the Building
        </Text>
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
        <Text style={styles.title} fontSize="2xl">
          Corner {latitude.length + 1}
        </Text>
      </Center>

      <Box w="100%" maxWidth="90%" mt="5">
        <Text numberOfLines={14}>
          Go to corner {latitude.length + 1} of the building and press the "Get GPS
          Location" button.
        </Text>
      </Box>

      <Box w="100%" maxWidth="75%" mt="5">
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
          Get GPS Location
        </Button>
      </Box>
    </View>
  ) : stepNumber === 3 ? (
    <View style={styles.pleaseWait}>
      <Center>
        <Text fontSize="2xl">
          Please wait
        </Text>
        <ActivityIndicator style={styles.activityIndicator} size="large" />
      </Center>
    </View>
  ) : stepNumber === 4 ? (
    <View style={styles.view}>
      <Center>
        <Text style={styles.title} fontSize="2xl">
          GPS Location Received for Corner {latitude.length}
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
          {latitude.length === 4 ? 'Save and Upload Floor Map' : 'Get Next GPS Location'}
        </Button>
        {latitude.length === 4 && (
          <Button
            mb="2"
            onPress={() => {
              navigation.navigate('AccessibilityScreen');
            }}>
            Discard GPS Locations
          </Button>
        )}
      </Box>
    </View>
  ) : null;
};

export default MapNewBuildingScreen;
