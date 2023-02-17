import React, { useContext, useEffect, useState, useRef } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import {NEXT_LABEL} from '../assets/locale/en';
import {ScrollView} from 'react-native';
import GetLocation from 'react-native-get-location';
// import KalmanFilter from 'kalmanjs';
import Geolocation from 'react-native-geolocation-service';
import Tts from 'react-native-tts';
import KalmanFilter from 'kalmanjs';

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
});

const maxBoundary = 0.000140;
let pathIndex = 0;
let ttsIndex = 0;
let firstGPSLocation = true;
let count = 0;
let averagelats = [];
let averagelongs = [];

const UserGuidanceScreen = ({route, navigation}) => {
  
    const [indexTracker, setIndexTracker] = useState([]);
    const [pointTracker, setPointTracker] = useState([]);
    const [coordinates, setCoordinates] = useState([]);
    const [stepName, setStepName] = useState('');
    const watchId = useRef(null);
    const [latDrift, setLatDrift] = useState(0);
    const [longDrift, setLongDrift] = useState(0);


    const kflat = new KalmanFilter();
    const kflong = new KalmanFilter();
    
    useEffect(() => {
      // for (node in route.params.path) {
      //   console.log(node)
      // }
      console.log(route.params.path)
      
      // watch position
      getLocationUpdates();
      
      // getlocation
      // getLocation();
      setStepName('start');
      checkTTS();
    }, []);

    const updateDrifts = (lat, long) => {
      let currentNode = null
      console.log(route.params.nodeList);
      for (let i = 0; i < route.params.nodeList.length; i++) {
        console.log(route.params.nodeList[i]['guid']);
        console.log(route.params.path[pathIndex]);
        console.log(route.params.nodeList[i]['guid'] === route.params.path[pathIndex]);
        if(route.params.nodeList[i]['guid'] === route.params.path[pathIndex]) {
          currentNode = route.params.nodeList[i];
          break;
        }
      }
      console.log(currentNode)
      // console.log("coord length:" + coordinates.length);
      // const currentLat = coordinates[coordinates.length - 1][0]
      // const currentLong = coordinates[coordinates.length - 1][1]

      setLatDrift(lat - currentNode['lat'])
      setLongDrift(long - currentNode['long'])
      // take latest position
      // compare it to current node in our path
      // take the difference
      // set equal to latdrift and longdrift
    }

    const getLocation = () =>{
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
      .then(location => {
          console.log(location);
          
          // regular long lat
          setCoordinates(coordinates => [...coordinates, ["cur:", location.latitude, ", "+ location.longitude, ", "+ location.accuracy]]);
          // for regular long lat
          // closestPoint(location.latitude, location.longitude);

          // averaged long lat 
          averagelats = [location.latitude, ...averagelats]
          averagelongs = [location.longitude, ...averagelongs]
          if(averagelats.length == 5){
            averagelats.pop()
            averagelongs.pop()

          }
          const calculatedAverageLat = averagelats.reduce((partialSum, a) => partialSum + a, 0)/averagelats.length
          const calculatedAverageLong = averagelongs.reduce((partialSum, a) => partialSum + a, 0)/averagelongs.length

          setCoordinates(coordinates => [...coordinates, ["cur:", location.latitude, ", "+ location.longitude, ", "+ location.accuracy]]);
          setCoordinates(coordinates => [...coordinates, ["avg:", calculatedAverageLat, ", "+ calculatedAverageLong, ", "+ location.accuracy]]);
          closestPoint(calculatedAverageLat, calculatedAverageLong);
      })
      .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
      })
    }

    const getLocationUpdates = async () => {
      console.log('watch Id: ' + watchId.current);
      if (watchId.current === null) {
        watchId.current = Geolocation.watchPosition(
          position => {
            // if (count % 10 == 0) {
            //   checkTTS();
            // }
            averagelats = [position.coords.latitude, ...averagelats]
            averagelongs = [position.coords.longitude, ...averagelongs]
            if(averagelats.length == 5){
              averagelats.pop()
              averagelongs.pop()

            }
            let calculatedAverageLat = averagelats.reduce((partialSum, a) => partialSum + a, 0)/averagelats.length
            let calculatedAverageLong = averagelongs.reduce((partialSum, a) => partialSum + a, 0)/averagelongs.length
            calculatedAverageLat = kflat.filter(calculatedAverageLat)
            calculatedAverageLong = kflong.filter(calculatedAverageLong)

            const percievedLat = position.coords.latitude + latDrift;
            const percievedLong = position.coords.longitude + longDrift;
            console.log("got gps", position.coords.latitude, position.coords.longitude, position.coords.accuracy, position.provider, position.coords.heading, position.coords.speed)
            // console.log(position)
            setCoordinates(coordinates => [...coordinates, ["cur:", percievedLat, ", "+ percievedLong, ", "+position.coords.accuracy]]);
            setCoordinates(coordinates => [...coordinates, ["avg:", calculatedAverageLat, ", "+ calculatedAverageLong, ", "+position.coords.accuracy]]);
            // closestPoint(percievedLat, percievedLong)
            console.log("avg with kal:", calculatedAverageLat, calculatedAverageLong)
            closestPoint(calculatedAverageLat, calculatedAverageLong)

            // if(firstGPSLocation) {
            //   updateDrifts(percievedLat, percievedLong);
            //   firstGPSLocation = false;
            // }
            // count++;
          },
          error => {
            setCoordinates(null);
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
        // setWatchId(watchIdRef);
        console.log('watch Id: ' + watchId.current);
      }
    };
    
    const stop = () => {
      if (watchId.current !== null) {
        console.log('watch is not null');
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }
  
    const distance = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    const checkTTS = () => {
      let guid = route.params.path[pathIndex];

      while(ttsIndex < route.params.tts.length && route.params.tts[ttsIndex][0] == guid) {
        Tts.speak(route.params.tts[ttsIndex][1]);
        ttsIndex++;
      }
      // pathIndex++;
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

      // console.log("min node=" + minNode["guid"])
      //if the closest node is the next node in the path
      if (minNode["guid"] === route.params.path[pathIndex + 1] && minVal < maxBoundary) {
        //update current index
        pathIndex++;
        console.log("checking tts, path index=" + pathIndex)
        checkTTS(minNode['lat'], minNode['long']);

        // updateDrifts();
        console.log("IndexTracker", indexTracker);

        setIndexTracker(indexTracker => [...indexTracker, pathIndex]);
        setIndexTracker(indexTracker => [
          ...indexTracker,
          'update coordinates: ' + lat + ', ' + long
        ]);

        if(pathIndex === route.params.path.length) {
          stop();
          setStepName('Done');
        }
      }
      setCoordinates(coordinates => [...coordinates, [pathIndex + " " + indexTracker]]);
      console.log("minNode", minNode)
      console.log("minDistance", minVal)
      console.log("PathIndex", pathIndex);
      setPointTracker(pointTracker => [...pointTracker, 'POINT3: ' + pathIndex]);
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
        <Button 
          title="Get Location"
          style={styles.button}
          onPress={getLocation} />
        {/* <Button
          title="Stop"
          style={styles.button}
          onPress={stop}>
            <Text style={styles.buttonText}>Stop</Text>
        </Button> */}
        {stepName == 'start' ? (
          <View maxHeight="65%">
            <FlatList
              data={coordinates}
              selectable={true}
              renderItem={({item}) => (
                <>
                  <Text style={styles.dividerText}>
                    {item}
                  </Text>
                </>
              )}
            />
          </View>
        ) : stepName == 'Done' ? (
          <Button
            title="Stop"
            style={styles.button}
            onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Go back to Login</Text>
          </Button>
        ) : (
          <></>
        )}
      </View>
    );

};

export default UserGuidanceScreen;

