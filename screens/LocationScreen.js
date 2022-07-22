import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, View, Text } from 'react-native';
import GetLocation from "react-native-get-location";

const LocationScreen = () => {

    const [longitude, setLongitude] = useState([]);
    const [latitude, setLatitude] = useState([]);

    const [mapState, setMapState] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (mapState === true) {
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                })
                .then(location => {
                    console.log(JSON.stringify(location.latitude) + ',' + JSON.stringify(location.longitude));
                    setLatitude(latitude => [JSON.stringify(location.latitude), ...latitude]);
                    setLongitude(longitude => [JSON.stringify(location.longitude), ...longitude]);
                })
                .catch(error => {
                    console.log("Got an error : " + error.message);
                });
            }
        }, 5000);

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
                    <View style={{display:'flex', flexDirection:'column'}}>
                        {latitude.slice(0, 50).map((l, id) => 
                            <Text key={id} style={{marginBottom: 20}}>Latitude: {l}</Text>
                        )}
                    </View>
                    <View style={{display:'flex', flexDirection:'column'}}>
                        {longitude.slice(0, 50).map((l, id) => 
                            <Text key={id} style={{marginBottom: 20}}>  Longitude: {l}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default LocationScreen;