import React, {useContext, useState} from 'react';

import {StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import Geolocation from 'react-native-geolocation-service';

import {GPSCornerSelectionContext} from '../../screens/MapNewBuildingScreen';
import {
  DISCARD_GPS_LOCATIONS_LABEL,
  FIRST_LOCATION_MESSAGE,
  GET_CURRENT_LOCATION_LABEL,
  LOCATION_OF_CORNER_TITLE,
  NEXT_LOCATION_MESSAGE,
  SAVE_UPLOAD_MAP_LABEL,
  DESCRIPTION,
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

const GPSCornerSelection = ({navigation}) => {
  const {long, lat, step, postFunction} = useContext(GPSCornerSelectionContext);
  const [longitude, setLongitude] = long;
  const [latitude, setLatitude] = lat;
  const [stepName, setStepName] = step;
  const [postCoordinates] = postFunction;

  const [gpsObtained, setGpsObtained] = useState(false);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        setLatitude(latitude => [...latitude, position.coords.latitude]);
        setLongitude(longitude => [...longitude, position.coords.longitude]);
        Alert.alert('SUCCESS', 'Current Location Obtained', [
          {text: 'OK', onPress: () => setStepName('gps_call')},
        ]);
      },
      error => {
        console.log(error.code, error.message);
        setStepName('gps_call');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
          <Text style={styles.buttonText}>{SAVE_UPLOAD_MAP_LABEL}</Text>
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AccessibilityScreen');
          }}
          style={styles.discardButton}>
          <Text style={styles.buttonText}>{DISCARD_GPS_LOCATIONS_LABEL}</Text>
        </TouchableOpacity>
      </Box>
    </>
  );
};

export default GPSCornerSelection;
