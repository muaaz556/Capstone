import React from 'react';

import {View, StyleSheet} from 'react-native';

import {
  Box,
  Button,
  Center,
  FormControl,
  Image,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
} from 'native-base';
import {getGPSData, postGPSData} from '../helper-functions/gpsFetching';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 26,
    paddingTop: 20,
    fontWeight: '500',
    color: '#353d3f',
  },
  titleSubText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 30,
    fontWeight: '400',
    color: '#808585',
  },
  inputBox: {
    marginBottom: 10,
  },
  inputField: {
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
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
});

const LoginScreen = ({navigation}) => {

  const handleGuestStudentButtonClick = () => {
    console.log('Fetching data');
    getGPSData();
  };

  return (
    <View style={styles.view}>
      <Image
        style={styles.logoImage}
        source={require('../assets/images/splashscreen_logo.png')}
        size="lg"
        alt="Logo image"
      />
      <Text style={styles.titleText}>Welcome to Eye Guide!</Text>
      <Text style={styles.titleSubText}>Choose an option to begin!</Text>

      <Box w="100%" maxWidth="300px">
        <FormControl isRequired>
          <Stack mx="0">
            <Button
              style={styles.button}
              onPress={() => {}/*() => navigation.navigate('AdminHomeScreen')*/}>
              <Text style={styles.buttonText}>Guest Admin</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('NavigationScreen')}>
              <Text style={styles.buttonText}>Guest Student</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('AccessibilityScreen')}>
              <Text style={styles.buttonText}>Accessibility</Text>
            </Button>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('TestSensorModulesScreen')}>
              <Text style={styles.buttonText}>Test Sensor Modules</Text>
            </Button>
          </Stack>
        </FormControl>
      </Box>
    </View>
  );
};

export default LoginScreen;
