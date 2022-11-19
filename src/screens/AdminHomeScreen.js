import React from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Spacer, Text, View} from 'native-base';
import DistanceSensingComponent from '../components/atoms/DistanceSensorComponent';
import {
  DISTANCE_LIMIT,
  ENABLE_DISTANCE_SENSOR_VIBRATION,
  VIBRATION_DURATION,
} from '../common/constants';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
});

const AdminHomeScreen = () => {
  return (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Welcome [ Admin User ]</Text>
      </Center>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button mb="2">Create New Mapping</Button>
        <Button>View Existing Mappings</Button>
      </Box>
      <DistanceSensingComponent
        enableVibration={ENABLE_DISTANCE_SENSOR_VIBRATION}
        distanceLimit={DISTANCE_LIMIT}
        vibrationDuration={VIBRATION_DURATION}></DistanceSensingComponent>
    </View>
  );
};

export default AdminHomeScreen;
