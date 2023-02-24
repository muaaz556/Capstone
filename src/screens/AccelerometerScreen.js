import React, { useContext, useEffect, useState, useRef } from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text, View, Image, FlatList, FormControl} from 'native-base';
import { getGPSData } from '../helper-functions/gpsFetching';
import ListItems from '../components/molecules/ListItems';
import {NEXT_LABEL} from '../assets/locale/en';
import {ScrollView} from 'react-native';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import Tts from 'react-native-tts';
import { magnetometer, setUpdateIntervalForType, SensorTypes, gyroscope, accelerometer } from "react-native-sensors";
import {
  combineLatest
} from "rxjs";
import {
  map
} from 'rxjs/operators';



const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  dividerText: {
    textAlign: 'center',
    color: '#808585',
    paddingHorizontal: 10,
  },
});

//get a sporadic magnetometer reading to re-calibrate the orientation the phone is relative to true north
//use combinedStream to package all 3 subscriptions into 1
//after each reading, call function to calculate new angle
//after calculating new angle, calcuate the change in x,y,z position using acceleration
//using magnetometer, convert this change in x,y,z to a change in NSEW and from there, convert to change in Lat, Long



const AccelerometerScreen = ({navigation}) => {

  const [magnet, setMagnet] = useState([]);
  const [gyro, setGyro] = useState([]);
  const [stream, setStream] = useState([]);
  const [accel, setAccel] = useState([]);
  const watchId = useRef(null);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    setUpdateIntervalForType(SensorTypes.gyroscope, 500);
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    const magnetSubscription = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      console.log({ x, y, z, timestamp })
      // setMagnet(magnet => [...magnet, [x,y,z,timestamp]])
      setMagnet([x, y, z, timestamp])
    });

    const gyroSubscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
      processGyro([x,y,z,timestamp])
      console.log({ x, y, z, timestamp })
      setGyro([x,y,z,timestamp])
    });

    const accelSubscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      // console.log({ x, y, z, timestamp })
      setAccel([x,y,z,timestamp])
    });

    // const combinedStream = combineLatest(
    //   accelerometer,
    //   magnetometer,
    //   gyroscope
    // ).pipe(
    //   map(([accelerometerValue, magnetometerValue, gyroscopeValue]) => ({
    //     accelerometer: accelerometerValue,
    //     magnetometer: magnetometerValue,
    //     gyroscope: gyroscopeValue
    //   }))
    // )

    // combinedStream.subscribe(({ item }) => {
    //     console.log(item.accelerometer)
    //     console.log(item.magnetometer)
    //     console.log(item.gyroscope)
    //     setStream([item])
    //   });
  }, []);


  const processGyro = ([x,y,z,timestamp]) => {

  }

  const processAccel = () => {

  }

  const processMagnet = () => {

  }
  

  



  return (
    <View style={styles.view}>
      {/* <Box w="100%" maxWidth="300px">
        <FormControl isRequired>
          <Stack mx="0">
            <Button
              style={styles.button}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Guest Admin</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Guest Student</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Accessibility</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Accelerometer</Text>
            </Button>
          </Stack>
        </FormControl>
      </Box> */}
      <View maxHeight="33%">
        <Text style={styles.dividerText}>
          {gyro}
        </Text>
      </View>
      <View maxHeight="33%">
        <Text style={styles.dividerText}>
          {magnet}
        </Text>
      </View>
      <View maxHeight="33%">
          <Text style={styles.dividerText}>
            {accel}
          </Text>
      </View>
    </View>
  );

};

export default AccelerometerScreen;

