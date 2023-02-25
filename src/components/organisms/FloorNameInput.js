import React, {useContext} from 'react';

import {StyleSheet, TextInput} from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import {FloorNameInputContext} from '../../screens/MapNewBuildingScreen';
import {FLOOR_NAME_TITLE, NEXT_LABEL, FLOOR_NAME_EXAMPLES, BUTTON} from '../../assets/locale/en';

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 3,
    padding: 10,
    borderRadius: 4,
    borderColor: 'black',
  },
  title: {
    paddingTop: '30%',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
  },
  boxCard: {
    paddingHorizontal: 18,
    borderRadius: 15,
    paddingVertical: 30,
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
});

const FloorNameInput = () => {
  const {floorName, stepName} = useContext(FloorNameInputContext);
  const [floorNameState, setFloorNameState] = floorName;
  const [stepNameState, setStepNameState] = stepName;

  return (
    <>
      <Text style={styles.title} fontSize="2xl">
        {FLOOR_NAME_TITLE}
      </Text>

      <Box w="100%" maxWidth="90%" mt="5" style={styles.boxCard}>
        <TextInput
          style={styles.input}
          onChangeText={e => setFloorNameState(e)}
          value={floorNameState}
          placeholder={FLOOR_NAME_EXAMPLES}
          placeholderTextColor="#808585"
        />
      </Box>
      <Box w="100%" maxWidth="75%" mt="5">
        <Button
          mb="4"
          style={styles.button}
          size="lg"
          onPress={() => {
            setStepNameState('gps_call');
          }}>
          <Text style={styles.buttonText}>{NEXT_LABEL}</Text>
        </Button>
        <Button
          mb="10"
          style={styles.button}
          size="lg"
          onPress={() => {
            setStepNameState('building_name');
          }}>
          <Text style={styles.buttonText}>{BUTTON.BACK}</Text>
        </Button>
      </Box>
    </>
  );
};

export default FloorNameInput;
