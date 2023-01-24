import React from 'react';

import {ActivityIndicator, StyleSheet} from 'react-native';
import {Center, Text, View} from 'native-base';
import {PLEASE_WAIT_MESSAGE} from '../../assets/locale/en';

const styles = StyleSheet.create({
  pleaseWait: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    padding: 10,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  pleaseWaitText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
    padding: 20,
  },
});

const PleaseWait = () => {
  return (
    <View style={styles.pleaseWait}>
      <Center>
        <Text style={styles.pleaseWaitText}>{PLEASE_WAIT_MESSAGE}</Text>
        <ActivityIndicator size="large" style={styles.activityIndicator} color="#1F8AA2"/>
      </Center>
    </View>
  );
};

export default PleaseWait;
