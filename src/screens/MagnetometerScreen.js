import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SensorTypes, Sensor } from 'react-native-sensors';

const MagnetometerScreen = () => {
  const [orientation, setOrientation] = useState({});

  useEffect(() => {
    const sensor = new Sensor({
      sensor: SensorTypes.RotationVector,
      updateInterval: 100, // update interval in milliseconds
    });

    sensor.setUpdateInterval(100);

    const subscription = sensor.subscribe(({ rotation }) => {
      const [x, y, z, w] = rotation;

      // Convert the quaternion to a rotation matrix
      const rotationMatrix = [
        1 - 2 * y * y - 2 * z * z,
        2 * x * y - 2 * z * w,
        2 * x * z + 2 * y * w,
        2 * x * y + 2 * z * w,
        1 - 2 * x * x - 2 * z * z,
        2 * y * z - 2 * x * w,
        2 * x * z - 2 * y * w,
        2 * y * z + 2 * x * w,
        1 - 2 * x * x - 2 * y * y,
      ];

      // Compute the orientation
      const orientationRadians = [
        Math.atan2(rotationMatrix[1], rotationMatrix[4]),
        Math.asin(-rotationMatrix[7]),
        Math.atan2(-rotationMatrix[6], rotationMatrix[8]),
      ];

      // Convert to degrees
      const orientationDegrees = orientationRadians.map((r) => r * (180 / Math.PI));

      setOrientation({
        azimuth: orientationDegrees[0],
        pitch: orientationDegrees[1],
        roll: orientationDegrees[2],
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { azimuth, pitch, roll } = orientation;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Azimuth: {azimuth?.toFixed(2)} Pitch: {pitch?.toFixed(2)} Roll: {roll?.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default MagnetometerScreen;