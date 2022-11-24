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

  const kflat = new KalmanFilter();
  const kflong = new KalmanFilter();

  //amio sidewalk
//  const array = [
//    [49.2329706, -123.0626055], // 0.000158
//    [49.2329715, -123.0624476], // 0.000219
//    [49.2329728, -123.0622286],
//  ];

//  const maxBoundary = 0.0003285; //0.000219 * 1.5

  // // Location of muaaz (indoor straight path)
  // const array = [
  //   [43.4104967, -80.2795297], // 0.000047
  //   [43.4105254, -80.2794921], // 0.000056
  //   [43.4105505, -80.2794425],
  // ];

  // const maxBoundary = 0.0000616; //0.000056 * 1.1

  //Location of muaaz (indoor 4 corners)
  // const array = [
  //   [43.4105259, -80.2795625], // 0.000069
  //   [43.4104787, -80.2795106], // 0.0001
  //   [43.4105347, -80.2794378], // 0.000071
  //   [43.4105724, -80.2794814],
  // ];

  // const maxBoundary = 0.00005; //0.0001 * 1.1

  // Muaaz yard
  // const array = [
  //   [43.4104843, -80.2794714],
  //   [43.4105556, -80.2793678],
  //   [43.4106328, -80.2793899],
  //   [43.4106759, -80.279474],
  // ];

  // const maxBoundary = 0.00003;

  const array = [
    [49.2329691, -123.0626058],
    [49.2329708, -123.0624003], // 0.000206
    [49.2330052, -123.0622078], // 0.000196
    [49.2332381, -123.0622109], // 0.000233
  ]

  const maxBoundary = 0.000196;
  var currentIndex = 0;

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

    let point = distanceArray.indexOf(minVal);

    if (
      (currentIndex === point || currentIndex + 1 === point) &&
      minVal < maxBoundary
    ) {
      currentIndex = point;
      setIndexTracker(indexTracker => [...indexTracker, currentIndex]);
      setIndexTracker(indexTracker => [
        ...indexTracker,
        'update coordinates: ' + coordinateX + ', ' + coordinateY,
      ]);
      //console.log('currentIndex: ' + currentIndex);
      console.log('update coordinate: ' + coordinateX + ', ' + coordinateY);
    }
    setPointTracker(pointTracker => [...pointTracker, 'POINT3: ' + point]);
    console.log('point: ' + point);
    console.log('currentIndex: ' + currentIndex);
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
    <View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 100,
        }}>
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
