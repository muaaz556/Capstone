import React, { useContext } from 'react';

import { StyleSheet, TextInput } from 'react-native';
import { Box, Button, Center, Text } from 'native-base';
import { BuildingNameInputContext } from '../../screens/MapNewBuildingScreen';
import { BUILDING_NAME_TITLE, NEXT_LABEL } from '../../assets/locale/en';

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        width: 200,
        borderWidth: 1,
        padding: 10,
    },
    title: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});

const BuildingNameInput = () => {
    const { buildingName, stepName } = useContext(BuildingNameInputContext);
    const [buildingNameState, setBuildingNameState] = buildingName;
    const [stepNameState, setStepNameState] = stepName;

    return (
        <>
            <Center>
                <Text style={styles.title} fontSize="2xl">
                    {BUILDING_NAME_TITLE}
                </Text>
            </Center>

            <TextInput
                style={styles.input}
                onChangeText={e => setBuildingNameState(e)}
                value={buildingNameState}
            />

            <Box w="100%" maxWidth="75%" mt="5">
                <Button mb="2" onPress={() => { setStepNameState('gps_call'); }}>
                    {NEXT_LABEL}
                </Button>
            </Box>
        </>
    )
}

export default BuildingNameInput;