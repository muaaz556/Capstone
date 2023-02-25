import React from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View, Image} from 'native-base';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#005AB5',
  },
  title: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
    marginBottom: '2%',
  },
  logoImage: {
    marginTop: '20%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  dividerText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#808585',
  },
});

const AccessibilityScreen = ({navigation}) => {
  return (
    <View style={styles.view}>
      <Image
        style={styles.logoImage}
        source={require('../assets/images/splashscreen_logo.png')}
        size="lg"
        alt="Logo of a person walking with a white cane."
      />
      <Text style={styles.title} fontSize="2xl">
        Accessibility
      </Text>

      <Box w="100%" maxWidth="75%" mt="5">
        <View style={styles.dividerView}>
          <View style={styles.dividerLine} />
          <View>
            <Text style={styles.dividerText}>Choose an option</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>
        <Button
          mb="4"
          style={styles.button}
          size="lg"
          onPress={() => navigation.navigate('MapNewBuildingScreen')}>
          <Text style={styles.buttonText}>Map New Building</Text>
        </Button>
        <Button
          mb="4"
          style={styles.button}
          size="lg"
          onPress={() => navigation.navigate('MapExistingBuildingScreen')}>
          <Text style={styles.buttonText}>Map Existing Building</Text>
        </Button>
      </Box>
    </View>
  );
};

export default AccessibilityScreen;
