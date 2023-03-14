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
    marginBottom: 20,
  },
  titleText: {
    fontSize: 28,
    paddingTop: 26,
    fontWeight: '800',
    color: 'black',
    marginBottom: '2%',
  },
  titleSubText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 30,
    fontWeight: '500',
    color: 'black',
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
    backgroundColor: '#005AB5',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  dividerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  }
});

const LoginScreen = ({navigation}) => {

  return (
    <View style={styles.view}>
      <Image
        accessible={true}
        style={styles.logoImage}
        source={require('../assets/images/splashscreen_logo.png')}
        size="lg"
        alt="Logo of a person walking with a white cane."
      />
      <Text style={styles.titleText}>Welcome to Eye Guide</Text>
      <Text style={styles.titleSubText}>Choose an option to begin</Text>

      <Box w="100%" maxWidth="350px">
        <Stack mx="1" safeArea mt={20} space="lg">
          <Button
            style={styles.button}
            size="lg"
            accessible={true}
            accessibilityHint="Go to select a building for navigation"
            accessibilityLabel="Student"
            accessibilityRole="button"
            onPress={() => navigation.navigate('NavigationScreen')}>
            <Text style={styles.buttonText}>Student</Text>
          </Button>
          <Button
            style={styles.button}
            size="lg"
            accessible={true}
            accessibilityLabel="Accessibility"
            accessibilityHint="Go to map a building for navigation"
            accessibilityRole="button"
            onPress={() => navigation.navigate('AccessibilityScreen')}>
            <Text style={styles.buttonText}>Accessibility</Text>
          </Button>
        </Stack>
      </Box>
    </View>
  );
};

export default LoginScreen;
