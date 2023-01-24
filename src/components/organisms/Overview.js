import React, {useContext} from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import {
  OVERVIEW_MESSAGE,
  OVERVIEW_PAGE_TITLE,
  START_LABEL,
  OVERVIEW_INTRO_MESSAGE,
} from '../../assets/locale/en';
import {OverviewContext} from '../../screens/MapNewBuildingScreen';

const styles = StyleSheet.create({
  title: {
    paddingTop: "30%",
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  boxCard: {
    backgroundColor: '#DEDEDE', padding: 18, borderRadius: 15,
  },
  decriptionTitle: {
    lineHeight: 20, fontWeight:'500',
  },
  description: {
    lineHeight: 20,
  }
});

const Overview = () => {
  const {stepName, setStepName} = useContext(OverviewContext);

  return (
    <>
      <Text style={styles.title} fontSize="2xl">
        {OVERVIEW_PAGE_TITLE}
      </Text>

      <Box w="100%" maxWidth="90%" mt="5" style={styles.boxCard}>
      <Text numberOfLines={10} style={styles.decriptionTitle}>
          {OVERVIEW_INTRO_MESSAGE}
        </Text>
        <Text numberOfLines={14} style={styles.description}>
          {OVERVIEW_MESSAGE}
        </Text>
      </Box>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button mb="2" onPress={() => setStepName('building_name')}>
        <Text style={styles.buttonText}>{START_LABEL}</Text>
        </Button>
      </Box>
    </>
  );
};

export default Overview;
