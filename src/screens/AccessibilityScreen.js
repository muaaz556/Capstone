import React from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View, Image} from 'native-base';

import CompassHeading from 'react-native-compass-heading';
import { useEffect } from 'react';
import { useState } from 'react';

import Geolocation from 'react-native-geolocation-service';

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

const AccessibilityScreen = ({navigation}) => {

  // For Magnotometer
  const [compassHeading, setCompassHeading] = useState(0);

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      // console.log("Compass Heading : ", heading, accuracy);
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  // For GPS Fetching
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGpsLocation();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getBearing = () => {
    a = {
      lat: 43.39616704373698, 
      lon: -80.295036596637
    };
    b = {
      lat: 43.39609865677969, 
      lon: -80.29503570395147
    };

    let delta_L = b.lon - a.lon;

    let X = Math.cos(b.lat) * Math.sin(delta_L);
    let Y = (Math.cos(a.lat) * Math.sin(b.lat)) - (Math.sin(a.lat) * Math.cos(b.lat) * Math.cos(delta_L));

    let bearing_rads = Math.atan2(X, Y);
    let bearing_degree = bearing_rads * 180 / Math.PI;

    console.log(bearing_degree);
  }

  const fetchGpsLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude + ", " + position.coords.longitude);
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
