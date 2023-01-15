import React from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View} from 'native-base';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
  },
});

const AccessibilityScreen = ({navigation}) => {
  return (
    <View style={styles.view}>
      <Center>
        <Text fontSize="2xl">Accessibility</Text>
      </Center>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="2"
          onPress={() => navigation.navigate('MapNewBuildingScreen')}>
          Map New Building
        </Button>
      </Box>
    </View>
  );
};

export default AccessibilityScreen;
