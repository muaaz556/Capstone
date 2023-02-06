import React, {useContext} from 'react';

import {StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Box, Button, Text} from 'native-base';
import Geolocation from 'react-native-geolocation-service';

import {GPSCornerSelectionContext} from '../../screens/MapNewBuildingScreen';
import {
  DISCARD_GPS_LOCATIONS_LABEL,
  FIRST_LOCATION_MESSAGE,
  GET_CURRENT_LOCATION_LABEL,
  LOCATION_OF_CORNER_TITLE,
  NEXT_LOCATION_MESSAGE,
  SAVE_UPLOAD_FLOOR_PLAN_LABEL,
  DESCRIPTION,
  BUTTON,
} from '../../assets/locale/en';

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    paddingTop: '30%',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
  },
  boxCard: {
    backgroundColor: '#DEDEDE',
    padding: 18,
    borderRadius: 15,
  },
  decriptionTitle: {
    lineHeight: 20,
    fontWeight: '500',
    paddingBottom: 12,
  },
  description: {
    lineHeight: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  discardButton: {
    alignItems: 'center',
    backgroundColor: '#D05959',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

let numTrys = 0;
let bestAccuracy = 10000;
let bestLatitude = 0;
let bestLongitude = 0;

let numOfGPSSamples = 3; //not number of corners
let delayBetweenPositionChecks = 1000; //in milliseconds

const GPSCornerSelection = ({navigation}) => {
  const {long, lat, step, postFunction} = useContext(GPSCornerSelectionContext);
  const [longitude, setLongitude] = long;
  const [latitude, setLatitude] = lat;
  const [stepName, setStepName] = step;
  const [postCoordinates] = postFunction;

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {

        if (position.coords.accuracy < bestAccuracy) {
          bestAccuracy = position.coords.accuracy;
          bestLatitude = position.coords.latitude;
          bestLongitude = position.coords.longitude;
        }

        if (numTrys === numOfGPSSamples - 1) {
          numTrys = 0;
          bestAccuracy = 10000;
          setLatitude(latitude => [...latitude, bestLatitude]);
          setLongitude(longitude => [...longitude, bestLongitude]);

          Alert.alert('SUCCESS', 'Current Location Obtained', [
            {text: 'OK', onPress: () => setStepName('gps_call')},
          ]);
        } else {
          numTrys = numTrys + 1;
          setTimeout(
            () => { getCurrentPosition(); },
            delayBetweenPositionChecks
          );
        }
      },
      error => {
        Alert.alert('FAIL', 'Location could not be obtained', [
          {text: 'OK', onPress: () => setStepName('gps_call')},
        ]);
        console.log(error.code, error.message);
        setStepName('gps_call');
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
    );
    setStepName('please_wait');
  };

  return (
    <>
      <Text style={styles.title} fontSize="2xl">
        {LOCATION_OF_CORNER_TITLE}
      </Text>

      <Box w="100%" maxWidth="90%" mt="5" style={styles.boxCard}>
        <Text numberOfLines={10} style={styles.decriptionTitle}>
          {DESCRIPTION}:
        </Text>
        {longitude.length > 0 ? (
          <>
            <Text numberOfLines={14} style={styles.description}>
              {NEXT_LOCATION_MESSAGE}
            </Text>
          </>
        ) : (
          <Text numberOfLines={14} style={styles.description}>
            {FIRST_LOCATION_MESSAGE}
          </Text>
        )}
      </Box>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="2"
          onPress={() => {
            getCurrentPosition();
          }}>
          <Text style={styles.buttonText}>{GET_CURRENT_LOCATION_LABEL}</Text>
        </Button>
        <Button
          mb="2"
          onPress={() => {
            postCoordinates();
          }}>
          <Text style={styles.buttonText}>{SAVE_UPLOAD_FLOOR_PLAN_LABEL}</Text>
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AccessibilityScreen');
          }}
          style={styles.discardButton}>
          <Text style={styles.buttonText}>{DISCARD_GPS_LOCATIONS_LABEL}</Text>
        </TouchableOpacity>
        <Button
          mb="2"
          onPress={() => {
            setStepName('floor_name');
          }}>
          <Text style={styles.buttonText}>{BUTTON.BACK}</Text>
        </Button>
      </Box>
    </>
  );
};

export default GPSCornerSelection;
