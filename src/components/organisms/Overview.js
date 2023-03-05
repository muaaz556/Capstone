import React, {useContext} from 'react';

import {StyleSheet} from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import {
  OVERVIEW_MESSAGE,
  OVERVIEW_PAGE_TITLE,
  START_LABEL,
  OVERVIEW_INTRO_MESSAGE,
  BUTTON,
} from '../../assets/locale/en';
import {OverviewContext} from '../../screens/MapNewBuildingScreen';

const styles = StyleSheet.create({
  title: {
    paddingTop: "30%",
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
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
  boxCard: {
    borderColor: 'black',
    borderWidth: 3,
    padding: 18,
    borderRadius: 15,
  },
  decriptionTitle: {
    lineHeight: 20, fontWeight:'500',
  },
  description: {
    lineHeight: 20,
  }
});

const Overview = () => {
  const {stepName, setStepName, navigateToLogin} = useContext(OverviewContext);

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
        <Button size="lg"
         style={styles.button}
         mb="4"
         onPress={() => setStepName('building_name')}>
        <Text style={styles.buttonText}>{START_LABEL}</Text>
        </Button>
        <Button
          mb="10"
          style={styles.button}
          size="lg"
          onPress={navigateToLogin}>
          <Text style={styles.buttonText}>{BUTTON.BACK}</Text>
        </Button>
      </Box>
    </>
  );
};

export default Overview;
