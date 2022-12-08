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


let subscription = null;
let prevTimestamp = 0;

//start button
//stop button OR get values for a certain amount of time
//single output - the averaged location value

const AccelerationScreen = ({ }) => {

    const [accelXData, setAccelXData] = useState([]);
    const [accelYData, setAccelYData] = useState([]);

    const [avgXData, setAvgXData] = useState([]);
    const [avgYData, setAvgYData] = useState([]);

    const [vix, setVix] = useState(0);
    const [viy, setViy] = useState(0);
    
    const [veloXData, setVeloXData] = useState([]);
    const [veloYData, setVeloYData] = useState([]);

    const [distXData, setDistXData] = useState([]);
    const [distYData, setDistYData] = useState([]);

    setUpdateIntervalForType(SensorTypes.accelerometer, 200);
    
    const _getData = () => {
        subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
            x = _roundAcceleration(x);
            y = _roundAcceleration(y);
            // console.log( "x: " + x.toFixed(2) + " y: " + y.toFixed(2) + " prevTimestamp: " + prevTimestamp + " timestamp: " + timestamp);
            console.log( "x: " + x.toFixed(2) + " y: " + y.toFixed(2));

            setAccelXData(accelXData => [x, ...accelXData]);
            setAccelYData(accelYData => [y, ...accelYData]);

            
            if(prevTimestamp !== 0) {
                const vx = _calcVelocity(vix, x, prevTimestamp, timestamp);
                const dx = _calcDistance(vix, vx, prevTimestamp, timestamp);
                const vy = _calcVelocity(viy, y, prevTimestamp, timestamp);
                const dy = _calcDistance(viy, vy, prevTimestamp, timestamp);
                console.log("vx: " + vx.toFixed(2) + " dx: " + dx.toFixed(2) + " vy: " + vy.toFixed(2) + " dy: " + dy.toFixed(2));
                // console.log("vix: " + vix.toFixed(2) + " viy: " + viy.toFixed(2));

                setVeloXData(veloXData => [vx, ...veloXData]);
                setVeloYData(veloYData => [vy, ...veloYData]);
                
                setDistXData(distXData => [dx, ...distXData]);
                setDistYData(distYData => [dy, ...distYData]);

                setVix(vx);
                setViy(vy);
            } 
            
            prevTimestamp = timestamp;
        });

        return () => subscription.unsubscribe();
    }

    const _roundAcceleration = (accel) => {
        if (Math.abs(accel) <= 1) {
            return 0;
        }
        return accel;
    }

    const _calcVelocity = (vi, a, timestamp1, timestamp2) => {
        const dt = (timestamp2 - timestamp1) / 1000;
        return (vi) + a*dt;
    }

    const _calcDistance = (vi, vf, timestamp1, timestamp2) => {
        const dt = (timestamp2 - timestamp1) / 1000;
        return (vi + vf) * dt / 2;
    }

    const _clearData = () => {
        subscription.unsubscribe();

        console.log(accelXData);
        console.log(accelYData);
        //average calc
        const avgX = accelXData.reduce((a, b) => a + b) / accelXData.length;
        const avgY = accelYData.reduce((a, b) => a + b) / accelYData.length;
        
        
        setAvgXData(avgXData => [avgX, ...avgXData]);
        setAvgYData(avgYData => [avgY, ...avgYData]);

        console.log(avgXData);
        console.log(avgYData);

        console.log(distXData.reduce((a, b) => a + b));
        console.log(distYData.reduce((a, b) => a + b));

        setAccelXData([]);
        setAccelYData([]);

        setVeloXData([]);
        setVeloYData([]);

        setDistXData([]);
        setDistYData([]);

        prevTimestamp = 0;
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