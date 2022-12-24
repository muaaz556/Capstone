import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from "native-base";

import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center'
    }
})

const GPSTestScreen = ({ }) => {

    const [accelData, setAccelData] = useState([{x: '', y: '', z: '', timestamp: ''}]);

    setUpdateIntervalForType(SensorTypes.accelerometer, 5000);
    
    const _getData = () => {
        const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
            console.log({ x, y, z, timestamp });
            setAccelData(accelData => [{ x, y, z, timestamp }, ...accelData]);
        });

        return () => subscription.unsubscribe();
    }

    const _clearData = () => {
        setAccelData([]);
    }

    return (
        <View style={styles.view}>
            
            <Box w="100%" maxWidth="75%" mt="5">
                <Button mb="2">Set Initial Location</Button>
                <Button mb="2">List GPS data</Button>
            </Box>

            <Button title="Get Data" mb="2" onPress={_getData}>Get Data </Button>
            <Button title="Clear Data" onPress={_clearData}>Clear Data </Button>

            <ScrollView>
                {accelData.slice(0, 50).map((data, id) => 
                    <Text key={id} style={{marginBottom: 20}}>X: {data.x} Y: {data.y} Z: {data.z} Timestamp: {data.timestamp}</Text>
                )}
            </ScrollView>
            
        </View>
    )
}

export default GPSTestScreen;