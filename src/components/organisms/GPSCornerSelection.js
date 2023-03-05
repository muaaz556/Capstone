
import React, {useState, useContext} from 'react';
import { View } from 'native-base';


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
import Dialog from "react-native-dialog";


const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: 300,
    borderRadius: 4,
    borderWidth: 3,
    padding: 10,
  },
  title: {
    paddingTop: '10%',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
  },
  boxCard: {
    padding: 18,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: 'black',
  },
  decriptionTitle: {
    lineHeight: 20,
    fontWeight: '800',
    fontSize: 16,
    paddingBottom: 12,
  },
  description: {
    lineHeight: 20,
    fontWeight: '400',
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#005AB5',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  discardButton: {
    alignItems: 'center',
    backgroundColor: '#D05959',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [latInput, setLatInput] = useState("");
  const [longInput, setLongInput] = useState("");




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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  }

  return (
    <>
      <View>
          <Dialog.Container visible={modalVisible}>
              <Dialog.Title>{"Add Coordinate"}</Dialog.Title>
              <Dialog.Description>
                  {"Manually add GPS coordinate"}
              </Dialog.Description>
              <Dialog.Input onChangeText={(input) => {setLatInput(input)}} value={latInput} placeholder="Latitude" keyboardType='numeric'/>
              <Dialog.Input onChangeText={(input) => {setLongInput(input)}} value={longInput} placeholder="Longitude" keyboardType='numeric'/>
              <Dialog.Button label="Cancel" onPress={() => {
                toggleModal()
                setLatInput("")
                setLongInput("")
                }}/>
              <Dialog.Button label="Ok" disabled={latInput == "" || longInput == ""} onPress={() => {
                  setLatitude(latitude => [...latitude, Number(latInput)]);
                  setLongitude(longitude => [...longitude, Number(longInput)]);
                  setStepName('gps_call')
                  setLatInput("")
                  setLongInput("")
                  setModalVisible(false)
                  }}/>
          </Dialog.Container>
      </View>
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
          mb="4"
          style={styles.button}
          size="lg"
          onPress={() => {
            toggleModal();
          }}>
          <Text style={styles.buttonText}>Manual Input</Text>
        </Button>
        <Button
          mb="4"
          style={styles.button}
          size="lg"
          onPress={() => {
            getCurrentPosition();
          }}>
          <Text style={styles.buttonText}>{GET_CURRENT_LOCATION_LABEL}</Text>
        </Button>
        <Button
          mb="4"
          style={styles.button}
          size="lg"
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
          mb="10"
          style={styles.button}
          size="lg"
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
