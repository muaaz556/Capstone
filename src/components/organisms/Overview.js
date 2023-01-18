import React, { useContext } from 'react';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text } from 'native-base';
import { OVERVIEW_MESSAGE, OVERVIEW_PAGE_TITLE, START_LABEL } from '../../assets/locale/en';
import { OverviewContext } from '../../screens/MapNewBuildingScreen';

const styles = StyleSheet.create({
    title: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
});

const Overview = () => {
    const { stepName, setStepName } = useContext(OverviewContext);

    return (
        <>
            <Center>
                <Text style={styles.title} fontSize="2xl">
                    {OVERVIEW_PAGE_TITLE}
                </Text>
            </Center>

            <Box w="100%" maxWidth="90%" mt="5">
                <Text numberOfLines={14} styles={styles.overview}>
                    {OVERVIEW_MESSAGE}
                </Text>
            </Box>

            <Box w="100%" maxWidth="75%" mt="5">
                <Button mb="2" onPress={() => setStepName('building_name')}>
                    {START_LABEL}
                </Button>
            </Box>
        </>
    )
}

export default Overview;