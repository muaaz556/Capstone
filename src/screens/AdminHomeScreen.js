import React from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text, View, Image} from 'native-base';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
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
});

const AdminHomeScreen = ({navigation}) => {
  return (
    <View style={styles.view}>
      <Image
        style={styles.logoImage}
        source={require('../assets/images/splashscreen_logo.png')}
        size="lg"
        alt="Logo image"
      />
      <Text style={styles.title} fontSize="2xl">
        Welcome Admin User
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
          mb="2"
          onPress={() => navigation.navigate('FloorMappingScreen')}>
          <Text style={styles.buttonText}>Create New Mapping</Text>
        </Button>
        <Button><Text style={styles.buttonText}>View Existing Mappings</Text></Button>
      </Box>
    </View>
  );
};

export default AdminHomeScreen;
