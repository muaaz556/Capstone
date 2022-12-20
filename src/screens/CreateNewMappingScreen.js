import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View} from 'native-base';
import KalmanFilter from 'kalmanjs';
import Geolocation from 'react-native-geolocation-service';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
});

//start button
//stop button OR get values for a certain amount of time
//single output - the averaged location value

const CreateNewMappingScreen = ({}) => {
  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);
  const [kLongitude, setKLongitude] = useState([]);
  const [kLatitude, setKLatitude] = useState([]);

  const [avgkLongitude, setKAvgLongitude] = useState([]);
  const [avgkLatitude, setKAvgLatitude] = useState([]);

  const [mapState, setMapState] = useState(false);

  const kflat = new KalmanFilter();
  const kflong = new KalmanFilter();

  let distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const _getData = () => {
    setMapState(true);
  };

  const _clearData = () => {
    setMapState(false);

    console.log(kLatitude);
    console.log(kLongitude);

    // if(kLatitude.length !== 0){
    //     const avgX = kLatitude.reduce((a, b) => a + b) / kLatitude.length;
    //     setKAvgLatitude(avgkLatitude => [avgX, ...avgkLatitude]);
    //     console.log(avgX);
    // }

    // if(kLongitude.length !== 0){
    //     const avgY = kLongitude.reduce((a, b) => a + b) / kLongitude.length;
    //     setKAvgLongitude(avgkLongitude => [avgY, ...avgkLongitude]);
    //     console.log(avgY);
    // }

    //average calc
    let currLatArray = [...kLatitude];
    let currLongArray = [...kLongitude];
    let flag = false;
    do {
      flag = false;
      const avgX = currLatArray.reduce((a, b) => a + b) / currLatArray.length;
      const avgY = currLongArray.reduce((a, b) => a + b) / currLongArray.length;
      console.log('');

      for (let i = currLatArray.length - 1; i >= 0; i--) {
        const dist = distance(avgX, avgY, currLatArray[i], currLongArray[i]);
        if (dist > 0.000054) {
          currLatArray.splice(i, 1);
          currLongArray.splice(i, 1);
          flag = true;
        }
      }
    } while (flag);

    console.log('pruning done');

    if (currLatArray.length !== 0) {
      const avgX = currLatArray.reduce((a, b) => a + b) / currLatArray.length;
      console.log(avgX);
    }

    if (currLongArray.length !== 0) {
      const avgY = currLongArray.reduce((a, b) => a + b) / currLongArray.length;
      console.log(avgY);
    }
    if (kLatitude.length !== 0) {
      const avgX = kLatitude.reduce((a, b) => a + b) / kLatitude.length;
      setKAvgLatitude(avgkLatitude => [avgX, ...avgkLatitude]);
      console.log(avgX);
    }

    if (kLongitude.length !== 0) {
      const avgY = kLongitude.reduce((a, b) => a + b) / kLongitude.length;
      setKAvgLongitude(avgkLongitude => [avgY, ...avgkLongitude]);
      console.log(avgY);
    }

    setKLatitude([]);
    setKLongitude([]);
  };

  // let counter = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapState === true) {
        // counter++;
        // if (counter === 50) {
        //   _clearData();
        // }
        Geolocation.getCurrentPosition(
          location => {
            // if (counter <= 50) {
              console.log(
                JSON.stringify(kflat.filter(location.coords.latitude)) +
                  ',' +
                  kflong.filter(location.coords.longitude) +
                  ' provider: ' +
                  location.provider,
              );
              setKLatitude(kLatitude => [
                ...kLatitude,
                kflat.filter(location.coords.latitude),
              ]);
              setKLongitude(kLongitude => [
                ...kLongitude,
                kflong.filter(location.coords.longitude),
              ]);
              setLatitude(latitude => [...latitude, location.coords.latitude]);
              setLongitude(longitude => [
                ...longitude,
                location.coords.longitude,
              ]);
            // }
          },
          error => {
            console.log('Got an error : ' + error.message);
          },
          {
            enableHighAccuracy: true,
            showLocationDialog: true,
            maximumAge: 0
            //timeout: 15000,
          },
        );
        // .then(location => {
        //   console.log(
        //     JSON.stringify(kflat.filter(location.latitude)) +
        //       ',' +
        //       kflong.filter(location.longitude),
        //   );
        //   setKLatitude(kLatitude => [
        //     ...kLatitude,
        //     kflat.filter(location.latitude),
        //   ]);
        //   setKLongitude(kLongitude => [
        //     ...kLongitude,
        //     kflong.filter(location.longitude),
        //   ]);
        //   setLatitude(latitude => [
        //     ...latitude,
        //     location.latitude,
        //   ]);
        //   setLongitude(longitude => [
        //     ...longitude,
        //     location.longitude,
        //   ]);
        // })
        // .catch(error => {
        //   console.log('Got an error : ' + error.message);
        // });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [mapState]);

  return (
    <View style={styles.view}>
      <Button title="Get Data" mb="2" onPress={_getData}>
        Get Data{' '}
      </Button>
      <Button title="Clear Data" onPress={_clearData}>
        Clear Data{' '}
      </Button>
    </View>
  );
};

export default CreateNewMappingScreen;
