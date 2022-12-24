import React, {useState, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Button, View} from 'native-base';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
});

//start button
//stop button OR get values for a certain amount of time
//single output - the averaged location value

const AveragingWatchPositionScreen = ({}) => {
  const [location, setLocation] = useState(null);
  const watchId = useRef(null);
  //let watchId = null;

  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);
  // const [kLongitude, setKLongitude] = useState([]);
  // const [kLatitude, setKLatitude] = useState([]);

  // const [avgkLongitude, setKAvgLongitude] = useState([]);
  // const [avgkLatitude, setKAvgLatitude] = useState([]);

  // const kflat = new KalmanFilter();
  // const kflong = new KalmanFilter();

  let distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const _clearData = () => {
    console.log('watch Id clear data: ' + watchId.current);
    if (watchId.current !== null) {
      console.log('watch is not null');
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    console.log('stopped observing');

    console.log(latitude);
    console.log(longitude);

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
    let currLatArray = [...latitude];
    let currLongArray = [...longitude];
    let flag = false;
    let counter = 0;
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
          counter++;
        }
      }
    } while (flag);

    console.log('pruning done, total number pruned:' + counter);

    if (currLatArray.length !== 0) {
      const avgX = currLatArray.reduce((a, b) => a + b) / currLatArray.length;
      console.log(avgX);
    }

    if (currLongArray.length !== 0) {
      const avgY = currLongArray.reduce((a, b) => a + b) / currLongArray.length;
      console.log(avgY);
    }

    setLatitude([]);
    setLongitude([]);
  };

  const getLocationUpdates = async () => {
    console.log('watch Id: ' + watchId.current);
    if (watchId.current === null) {
      watchId.current = Geolocation.watchPosition(
        position => {
          setLocation(position);
          console.log(
            position.coords.latitude +
              ',' +
              position.coords.longitude
          );

          setLatitude(latitude => [...latitude, position.coords.latitude]);
          setLongitude(longitude => [
            ...longitude,
            position.coords.longitude,
          ]);
        },
        error => {
          setLocation(null);
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 200,
          showLocationDialog: true,
        },
      );
      //setWatchId(watchIdRef);
      console.log('watch Id: ' + watchId.current);
    }
  };

  return (
    <View style={styles.view}>
      <Button title="Get Data" mb="2" onPress={getLocationUpdates}>
        Get Data{' '}
      </Button>
      <Button title="Clear Data" onPress={_clearData}>
        Clear Data{' '}
      </Button>
    </View>
  );
};

export default AveragingWatchPositionScreen;
