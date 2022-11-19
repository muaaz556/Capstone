import React, {useState, useEffect} from 'react';
import {Text, View, Vibration} from 'react-native';
import FusedLocation from 'react-native-fused-location';
import { PermissionsAndroid } from 'react-native';

class GPSComponent extends React.Component {

  async componentDidMount() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'App needs to access your location',
        message:
          'App needs access to your location ' +
          'so we can let our app be even more awesome.',
      },
    );
    if (granted) {
      FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

      // Get location once.
      const location = await FusedLocation.getFusedLocation();
      this.setState({lat: location.latitude, long: location.longitude});

      // Set options.
      FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED);
      FusedLocation.setLocationInterval(20000);
      FusedLocation.setFastestLocationInterval(15000);
      FusedLocation.setSmallestDisplacement(10);

      // Keep getting updated location.
      FusedLocation.startLocationUpdates();

      // Place listeners.
      this.subscription = FusedLocation.on('fusedLocation', location => {
        /* location = {
             latitude: 14.2323,
             longitude: -2.2323,
             speed: 0,
             altitude: 0,
             provider: 'fused',
             accuracy: 30,
             bearing: 10,
             mocked: false,
             timestamp: '1513190221416'
           }
           */
        console.log(location);
      });

      /* Optional
        this.errSubscription = FusedLocation.on('fusedLocationError', error => {
            console.warn(error);
        });
        */
    }
  }

  render() {
    return <Text>Test</Text>;
  }
}

export default GPSComponent;
