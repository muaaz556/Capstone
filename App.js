import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Button, View, Text} from 'react-native';
import GetLocation from 'react-native-get-location';
import KalmanFilter from 'kalmanjs';
import GPSComponent from './GPSComponent';

const App = () => {
  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);
  const [kLongitude, kSetLongitude] = useState([]);
  const [kLatitude, kSetLatitude] = useState([]);

  const [indexTracker, setIndexTracker] = useState([]);
  const [pointTracker, setPointTracker] = useState([]);

  const [mapState, setMapState] = useState(false);
  const [indexState, setIndexState] = useState(0);

  const kflat = new KalmanFilter();
  const kflong = new KalmanFilter();

  const array = [
    [49.2329706, -123.0626055], // 0.000158
    [49.2329715, -123.0624476], // 0.000219
    [49.2329728, -123.0622286],
  ];

  const maxBoundary = 0.0003285; //0.000219 * 1.5

  //var currentIndex = 0;

  let distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  //   let maxBoundary = () => {
  //     let boundsArray = [];
  //     array.forEach((node) => {
  //         boundsArray.push(distance(node))
  //     });
  //   }

  let closestPoint = (coordinateX, coordinateY) => {
    let distanceArray = [];
    array.forEach(point => {
      distanceArray.push(
        distance(point[0], point[1], coordinateX, coordinateY),
      );
    });
    let minVal = 100;
    distanceArray.forEach(val => {
      if (val < minVal) minVal = val;
    });

    point = distanceArray.indexOf(minVal);

    if (
      (indexState == point || indexState + 1 == point) &&
      minVal < maxBoundary
    ) {
      setIndexState(point);
      // currentIndex = point;
      setIndexTracker(indexTracker => [...indexTracker, point]);
    }
    setPointTracker(pointTracker => [...pointTracker, point]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapState === true) {
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => {
            console.log(
              JSON.stringify(kflat.filter(location.latitude)) +
                ',' +
                JSON.stringify(kflong.filter(location.longitude)),
            );
            //---------------------
            // console.log('Current index before: ' + indexState);
            closestPoint(location.latitude, location.longitude);
            // console.log('Current index after: ' + indexState);
            //---------------------
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
    setIndexState(0);
    setIndexTracker([])
    setPointTracker([])
  };

  return (
    <View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={{display: 'flex', flexDirection: 'row', marginBottom: 50}}>
          <Button
            title="Get Location"
            onPress={_getLocation}
            style={{backgroundColor: '#99004d', margin: 200}}></Button>
          <Button
            title="Stop Location"
            onPress={_stopLocation}
            style={{backgroundColor: '#99004d', margin: 200}}></Button>
          <Button
            title="Clear Location"
            onPress={_clearLocation}
            style={{backgroundColor: '#99004d', margin: 200}}></Button>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View
            style={{display: 'flex', flexDirection: 'column', marginRight: 20}}>
            <Text>Latitude</Text>
            <Text selectable={true}>
              {latitude.slice(0, 50).map((l, id) => (
                <Text
                  selectable={true}
                  key={id}
                  style={{marginBottom: 20, fontSize: 5}}>
                  {l}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
          <View
            style={{display: 'flex', flexDirection: 'column', marginRight: 20}}>
            <Text>Longitude</Text>
            <Text selectable={true}>
              {longitude.slice(0, 50).map((l, id) => (
                <Text
                  selectable={true}
                  key={id}
                  style={{marginBottom: 20, fontSize: 5}}>
                  {l}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
          <View
            style={{display: 'flex', flexDirection: 'column', marginRight: 20}}>
            <Text>Kalman Latitude</Text>
            <Text selectable={true}>
              {indexTracker.slice(0, 50).map((l, id) => (
                <Text
                  selectable={true}
                  key={id}
                  style={{marginBottom: 20, fontSize: 5}}>
                  {l}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text>Kalman Longitude</Text>
            <Text selectable={true}>
              {pointTracker.slice(0, 50).map((l, id) => (
                <Text
                  selectable={true}
                  key={id}
                  style={{marginBottom: 20, fontSize: 5}}>
                  {l}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default App;
