import React, {useContext} from 'react';

import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import {BuildingNameInputContext} from '../../screens/MapNewBuildingScreen';
import {BUILDING_NAME_TITLE, NEXT_LABEL} from '../../assets/locale/en';

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#808585',
  },
  title: {
    paddingTop: '30%',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '500',
    color: '#353d3f',
  },
  boxCard: {
    backgroundColor: '#DEDEDE',
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

const BuildingNameInput = () => {
  const {buildingName, stepName} = useContext(BuildingNameInputContext);
  const [buildingNameState, setBuildingNameState] = buildingName;
  const [stepNameState, setStepNameState] = stepName;

  return (
    <>
      <Text style={styles.title} fontSize="2xl">
        {BUILDING_NAME_TITLE}
      </Text>

      <Box w="100%" maxWidth="90%" mt="5" style={styles.boxCard}>
        <TextInput
          style={styles.input}
          onChangeText={e => setBuildingNameState(e)}
          value={buildingNameState}
          placeholder="Building name"
        />
      </Box>

      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="2"
          onPress={() => {
            setStepNameState('gps_call');
          }}>
          <Text style={styles.buttonText}>{NEXT_LABEL}</Text>
        </Button>
      </Box>
    </>
  );
};

export default BuildingNameInput;
