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

//start button
//stop button OR get values for a certain amount of time
//single output - the averaged location value

const AccelerationScreen = ({ }) => {

    const [accelXData, setAccelXData] = useState([]);
    const [accelYData, setAccelYData] = useState([]);

    const [avgXData, setAvgXData] = useState([]);
    const [avgYData, setAvgYData] = useState([]);
    
    //let subscription = null;

    // setUpdateIntervalForType(SensorTypes.accelerometer, 50);
    
    const _getData = () => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 50);
        const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
            console.log({ x, y, z, timestamp });
            setAccelXData(accelXData => [x, ...accelXData]);
            setAccelYData(accelYData => [y, ...accelYData]);
        });

        return () => subscription.unsubscribe();
    }

    const _calcDistance = (p1, p2, timestamp1, timestamp2) => {
        return (p2 - p1) * Math.pow(timestamp2 - timestamp1, 2)
    }

    const _clearData = () => {
        setUpdateIntervalForType(SensorTypes.accelerometer, 50000000);

        console.log(accelXData);
        console.log(accelYData);
        //average calc
        const avgX = accelXData.reduce((a, b) => a + b) / accelXData.length;
        const avgY = accelYData.reduce((a, b) => a + b) / accelYData.length;
        
        
        setAvgXData(avgXData => [avgX, ...avgXData]);
        setAvgYData(avgYData => [avgY, ...avgYData]);

        console.log(avgXData);
        console.log(avgYData);
        setAccelXData([]);
        setAccelYData([]);
    }

    return (
        <View style={styles.view}>

            <Button title="Get Data" mb="2" onPress={_getData}>Get Data </Button>
            <Button title="Clear Data" onPress={_clearData}>Clear Data </Button>

            {/* <ScrollView>
                {accelData.slice(0, 50).map((data, id) => 
                    <Text key={id} style={{marginBottom: 20}}>X: {data.x} Y: {data.y} Z: {data.z} Timestamp: {data.timestamp}</Text>
                )}
            </ScrollView> */}
            
        </View>
    )
}

export default AccelerationScreen;