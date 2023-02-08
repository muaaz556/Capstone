import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import {NEXT_LABEL} from '../assets/locale/en';
import {ScrollView} from 'react-native';
import GetLocation from 'react-native-get-location';
import KalmanFilter from 'kalmanjs';
import Geolocation from 'react-native-geolocation-service';
import Tts from 'react-native-tts';

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

const maxBoundary = 0.000196;
let currentIndex = 0;

const UserGuidanceScreen = ({route, navigation}) => {
  //calculate the path the user will follow, and assign TTS values to turns/going straight
  //have module for getting current gps location
  //use muaaz/amio's algorithm for comparing the current gps location to the list of nodes to determine which node user is currently at
  
    const [longitude, setLongitude] = useState([]);
    const [latitude, setLatitude] = useState([]);
    const [kLongitude, kSetLongitude] = useState([]);
    const [kLatitude, kSetLatitude] = useState([]);
  
    const [indexTracker, setIndexTracker] = useState([]);
    const [pointTracker, setPointTracker] = useState([]);
  
    const [mapState, setMapState] = useState(false);
  
    const kflat = new KalmanFilter();
    const kflong = new KalmanFilter();
  

  
    const distance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
  
    const closestPoint = (lat, long) => {
  
      //finds node closest to currently obtained GPS location
      let minVal = 100;
      let minNode = null;
      let nodeDistance = 0
      route.params.nodeList.forEach(node => {
        nodeDistance = distance(node['lat'], node['long'], lat, long);
        if (nodeDistance < minVal) {
          minVal = nodeDistance;
          minNode = node;
        }
      });
  
      //if the closest node is the next node in the path
      if (minNode.guid === route.params.path[currentIndex + 1] && minVal < maxBoundary) {
  
        //update current index
        currentIndex++;
        setIndexTracker(indexTracker => [...indexTracker, currentIndex]);
        setIndexTracker(indexTracker => [
          ...indexTracker,
          'update coordinates: ' + lat + ', ' + long
        ]);
      }

      setPointTracker(pointTracker => [...pointTracker, 'POINT3: ' + currentIndex]);
    };
  
    //point tracker, constantly tracks current point
    //index tracker, only tracks changes in nodes

    let numTrys = 0;
    let numOfGPSSamples = 3;
    let bestAccuracy = 10000;
    let bestLatitude = 0;
    let bestLongitude = 0;
    let delayBetweenPositionChecks = 1000;

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
            closestPoint(bestLatitude, bestLongitude);
          } else {
            numTrys++;
            setTimeout(
              () => { getCurrentPosition(); },
              delayBetweenPositionChecks
            );
          }
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 0},
      );
    };
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (mapState === true) {
          GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            //timeout: 15000,
          })
            .then(location => {
              console.log(
                JSON.stringify(kflat.filter(location.latitude)) +
                  ',' +
                  JSON.stringify(kflong.filter(location.longitude)),
              );
              closestPoint(location.latitude, location.longitude);
              kSetLatitude(kLatitude => [
                ...kLatitude,
                JSON.stringify(kflat.filter(location.latitude)),
              ]);
              kSetLongitude(kLongitude => [
                ...kLongitude,
                JSON.stringify(kflong.filter(location.longitude)),
              ]);
              setLatitude(latitude => [
                ...latitude,
                JSON.stringify(location.latitude),
              ]);
              setLongitude(longitude => [
                ...longitude,
                JSON.stringify(location.longitude),
              ]);
            })
            .catch(error => {
              console.log('Got an error : ' + error.message);
            });
        }
      }, 3000);
  
      return () => clearInterval(interval);
    }, [mapState]);
  
    const _getLocation = () => {
      setMapState(true);
    };
  
    const _stopLocation = () => {
      setMapState(false);
  
      console.log('Latitude: ');
      latitude.forEach(function (item, index) {
        console.log(item);
      });
  
      console.log('Longitude: ');
  
      longitude.forEach(function (item, index) {
        console.log(item);
      });
  
      console.log('Kalman Latitude: ');
      kLatitude.forEach(function (item, index) {
        console.log(item);
      });
  
      console.log('Kalman Longitude: ');
  
      kLongitude.forEach(function (item, index) {
        console.log(item);
      });
    };
  
    const _clearLocation = () => {
      setLatitude([]);
      setLongitude([]);
      setIndexTracker([]);
      setPointTracker([]);
    };

    return (
      <View style={styles.view}>
        <Image
          style={styles.logoImage}
          source={require('../assets/images/splashscreen_logo.png')}
          size="lg"
          alt="Logo image"
        />
        <Text style={styles.title} fontSize="2xl">
          User Guidance Screen
        </Text>
      </View>
    );

};

export default UserGuidanceScreen;

