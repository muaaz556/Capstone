import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button } from 'react-native';
import { Text, View} from 'react-native';

import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

const Accelerometer = () => {

    const [accelData, setAccelData] = useState([{x: '', y: '', z: '', timestamp: ''}]);

    setUpdateIntervalForType(SensorTypes.accelerometer, 5000);

    useEffect(() => {
        const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
            console.log({ x, y, z, timestamp });
            setAccelData(accelData => [{ x, y, z, timestamp }, ...accelData]);
        });

        return () => subscription.unsubscribe();
    }, [])

    const _clearData = () => {
        setAccelData([]);
    }
    
    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Button title="Clear Data" onPress={_clearData}/>
            <ScrollView>
                {accelData.slice(0, 50).map((data, id) => 
                    <Text key={id} style={{marginBottom: 20}}>X: {data.x} Y: {data.y} Z: {data.z} Timestamp: {data.timestamp}</Text>
                )}
            </ScrollView>
        </View>
    );
  };

  export default Accelerometer;