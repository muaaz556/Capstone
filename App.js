import React from 'react';

// import {
//   Text,
//   View,
// } from 'react-native';

import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, View, Text } from 'react-native';
import GetLocation from "react-native-get-location";
import KalmanFilter from 'kalmanjs';

const App = () => {

    const [longitude, setLongitude] = useState([]);
    const [latitude, setLatitude] = useState([]);
    const [kLongitude, kSetLongitude] = useState([]);
    const [kLatitude, kSetLatitude] = useState([]);

    const [mapState, setMapState] = useState(false);

    const kflat = new KalmanFilter();
    const kflong = new KalmanFilter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (mapState === true) {
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                })
                .then(location => {
                    console.log(JSON.stringify(kflat.filter(location.latitude)) + ',' + JSON.stringify(kflong.filter(location.longitude)));
                    kSetLatitude(kLatitude => [...kLatitude, JSON.stringify(kflat.filter(location.latitude))] );
                    kSetLongitude(kLongitude => [...kLongitude, JSON.stringify(kflong.filter(location.longitude))] );
                    setLatitude(latitude => [...latitude, JSON.stringify(location.latitude)]);
                    setLongitude(longitude => [...longitude, JSON.stringify(location.longitude)]);
                })
                .catch(error => {
                    console.log("Got an error : " + error.message);
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [mapState])

    const _getLocation = () => {
        setMapState(true);
    }

    const _stopLocation = () => {
        setMapState(false);

        console.log("Latitude: ")
        latitude.forEach(function (item, index) {
            console.log(item);
        });

        console.log("Longitude: ");

        longitude.forEach(function (item, index) {
            console.log(item);
        });

        console.log("Kalman Latitude: ")
        kLatitude.forEach(function (item, index) {
            console.log(item);
        });

        console.log("Kalman Longitude: ");

        kLongitude.forEach(function (item, index) {
            console.log(item);
        });
    }

    const _clearLocation = () => {
        setLatitude([]);
        setLongitude([]);
    }

    return (
        <View>
            <View style = {{alignItems:"center", justifyContent:"center"}}>
                <View style={{display:'flex', flexDirection:'row', marginBottom: 50}}>
                    <Button
                        title="Get Location"
                        onPress={_getLocation}
                        style={{backgroundColor:'#99004d', margin:200}}>
                    </Button>
                    <Button
                        title="Stop Location"
                        onPress={_stopLocation}
                        style={{backgroundColor:'#99004d', margin:200}}>
                    </Button>
                    <Button
                        title="Clear Location"
                        onPress={_clearLocation}
                        style={{backgroundColor:'#99004d', margin:200}}>
                    </Button>
                </View>
            </View>
            <ScrollView>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <View style={{display:'flex', flexDirection:'column', marginRight:20}}>
                        <Text>Latitude</Text>
                        <Text selectable={true}>
                            {latitude.slice(0, 50).map((l, id) =>
                                <Text selectable={true} key={id} style={{marginBottom: 20, fontSize:5}}>{l}{"\n"}</Text>
                            )}
                        </Text>
                    </View>
                    <View style={{display:'flex', flexDirection:'column', marginRight:20}}>
                        <Text>Longitude</Text>
                        <Text selectable={true}>
                            {longitude.slice(0, 50).map((l, id) =>
                                <Text selectable={true} key={id} style={{marginBottom: 20, fontSize:5}}>{l}{"\n"}</Text>
                            )}
                        </Text>
                    </View>
                    <View style={{display:'flex', flexDirection:'column', marginRight:20}}>
                        <Text>Kalman Latitude</Text>
                        <Text selectable={true}>
                            {kLatitude.slice(0, 50).map((l, id) =>
                                <Text selectable={true} key={id} style={{marginBottom: 20, fontSize:5}}>{l}{"\n"}</Text>
                            )}
                        </Text>
                    </View>
                    <View style={{display:'flex', flexDirection:'column'}}>
                        <Text>Kalman Longitude</Text>
                        <Text selectable={true}>
                            {kLongitude.slice(0, 50).map((l, id) =>
                                <Text selectable={true} key={id} style={{marginBottom: 20, fontSize:5}}>{l}{"\n"}</Text>
                            )}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default App;