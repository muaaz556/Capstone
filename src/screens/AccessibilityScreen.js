import React from 'react';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View, Image } from 'native-base';

import { useEffect, useState } from 'react';

import CompassHeading from 'react-native-compass-heading';
import Geolocation from 'react-native-geolocation-service';

const Haversine = require('haversine-position').Haversine;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
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

const gpsNodes = [
  {
    lat: 43.39612353588304,
    long: -80.29507559339233
  },
  {
    lat: 43.396130357206864,
    long: -80.29506620566102
  },
  {
    lat: 43.39613474234322,
    long: -80.29505547682521
  },
  {
    lat: 43.396140101953876,
    long: -80.29504340688494
  },
  {
    lat: 43.39614497432678,
    long: -80.29503468970586
  },
  {
    lat: 43.39614887222481,
    long: -80.29502329031784
  },
  {
    lat: 43.39615423183425,
    long: -80.29501323203428
  },
  {
    lat: 43.396158616968854,
    long: -80.2950025031985
  },
];

const AccessibilityScreen = ({ navigation }) => {

  const [gpsQueue, setGpsQueue] = useState([]);
  const [nodeIndex, setNodeIndex] = useState(0);

  // For Magnotometer
  const [compassHeading, setCompassHeading] = useState(0);

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
      // console.log("Compass Heading : ", heading, accuracy);
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  // For GPS Fetching
  useEffect(() => {
    setGpsQueue(oldArray => [gpsNodes[nodeIndex], ...oldArray]);
    setNodeIndex(nodeIndex => nodeIndex + 1);

    const interval = setInterval(() => {
      fetchGpsLocation();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchGpsLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        // console.log(position.coords.latitude + ", " + position.coords.longitude);
        setGpsQueue(oldArray => [{ lat: position.coords.latitude, long: position.coords.longitude }, ...oldArray]);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        distanceFilter: 0
      }
    )
  }

  useEffect(() => {
    if (gpsQueue.length == 2) {
      
      const prevCord = gpsQueue.pop();
      const currCord = gpsQueue.pop();

      const haversine = new Haversine({ lat: prevCord.lat, lng: prevCord.long });
      const bearing = haversine.getBearing({ lat: currCord.lat, lng: currCord.long });

      console.log("Prev: " + prevCord.lat + ", " + prevCord.long);
      console.log("Curr: " + currCord.lat + ", " + currCord.long);

      let dist = haversine.getDistance({ lat: currCord.lat, lng: currCord.long });

      if (dist > 1) {
        dist = Math.random();
      }

      const newCurrDest = getDestinationCord(prevCord.lat, prevCord.long, dist, 60);
      console.log(newCurrDest.lat + ", " + newCurrDest.long);
      console.log("Node Index: " + nodeIndex);

      const tempHaversine = new Haversine({ lat: newCurrDest.lat, lng: newCurrDest.long });
      const tempDist = tempHaversine.getDistance({ lat: gpsNodes[nodeIndex].lat, lng: gpsNodes[nodeIndex].long });
      const tempBearing = tempHaversine.getBearing({ lat: gpsNodes[nodeIndex].lat, lng: gpsNodes[nodeIndex].long });

      console.log("Origin: " + newCurrDest.lat + ", " + newCurrDest.long);
      console.log("Dest: " + gpsNodes[nodeIndex].lat + ", " + gpsNodes[nodeIndex].long);

      if (tempDist < 0.25 || tempBearing > (60 + 20) || tempBearing < (60 - 20)) {
        console.log("You have made it to node " + nodeIndex);
        setNodeIndex(nodeIndex => nodeIndex + 1);
      } 
      
      console.log("Temp Distance: " + tempDist);
      console.log("Temp Bearing: " + tempBearing + "\n");

      setGpsQueue(oldArray => [newCurrDest, ...oldArray]);

      // setGpsQueue(oldArray => [currCord, ...oldArray]);
    }
  }, [gpsQueue.length == 2]);

  Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
  }

  Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
  }

  const getDestinationCord = (lat_param, long_param, dist, bearing_param) => {
    const earthRadius = 6371000;

    const lat = Math.radians(lat_param);
    const long = Math.radians(long_param);
    const bearing = Math.radians(bearing_param);

    const destLat = Math.asin(Math.sin(lat) * Math.cos(dist / earthRadius) + Math.cos(lat) * Math.sin(dist / earthRadius) * Math.cos(bearing));
    const destLong = long + Math.atan2(Math.sin(bearing) * Math.sin(dist / earthRadius) * Math.cos(lat), Math.cos(dist / earthRadius) - Math.sin(lat) * Math.sin(destLat));

    console.log("Destination Cord: " + Math.degrees(destLat) + ", " + Math.degrees(destLong));

    return { lat: Math.degrees(destLat), long: Math.degrees(destLong) };
  }

  return (
    <View style={styles.view}>
      {/* <Image
        style={styles.logoImage}
        source={require('../assets/images/splashscreen_logo.png')}
        size="lg"
        alt="Logo image"
      /> */}

      <Image
        style={[
          styles.image,
          { transform: [{ rotate: `${360 - compassHeading}deg` }] },
        ]}
        resizeMode="contain"
        source={require('../assets/images/compass.png')}
        alt="Logo image"
      />

      <Text style={styles.title} fontSize="2xl">
        Accessibility
      </Text>

      <Box w="100%" maxWidth="75%" mt="5">
        <View style={styles.dividerView}>
          <View style={styles.dividerLine} />
          <View>
            <Text style={styles.dividerText}>Choose an option</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>
        <Button
          mb="2"
          onPress={() => navigation.navigate('MapNewBuildingScreen')}>
          <Text style={styles.buttonText}>Map New Building</Text>
        </Button>
        <Button
          mb="2"
          onPress={() => navigation.navigate('MapExistingBuildingScreen')}>
          <Text style={styles.buttonText}>Map Existing Building</Text>
        </Button>
      </Box>
    </View>
  );
};

export default AccessibilityScreen;