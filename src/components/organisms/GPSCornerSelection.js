import React, { useContext, useState } from 'react';

import { StyleSheet, Alert } from 'react-native';
import {Box, Button, Center, Text} from 'native-base';
import Geolocation from 'react-native-geolocation-service';

import { GPSCornerSelectionContext } from '../../screens/MapNewBuildingScreen';
import { DISCARD_GPS_LOCATIONS_LABEL, FIRST_LOCATION_MESSAGE, GET_CURRENT_LOCATION_LABEL, LOCATION_OF_CORNER_TITLE, NEXT_LOCATION_MESSAGE, SAVE_UPLOAD_MAP_LABEL } from '../../assets/locale/en';

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

const GPSCornerSelection = ({navigation}) => {
    const { long, lat, step, postFunction } = useContext(GPSCornerSelectionContext);
    const [longitude, setLongitude] = long;
    const [latitude, setLatitude] = lat;
    const [stepName, setStepName] = step;
    const [postCoordinates] = postFunction;

    const [gpsObtained, setGpsObtained] = useState(false);

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(position.coords.latitude);
                console.log(position.coords.longitude);
                setLatitude(latitude => [
                    ...latitude,
                    position.coords.latitude,
                ]);
                setLongitude(longitude => [
                    ...longitude,
                    position.coords.longitude,
                ]);
                Alert.alert('SUCCESS', 'Current Location Obtained', [
                {text: 'OK', onPress: () => setStepName('gps_call')},
                ]);
            },
            error => {
                console.log(error.code, error.message);
                setStepName('gps_call');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        setStepName('please_wait');
    }

    return (
        <>
            <Center>
                <Text style={styles.title} fontSize="2xl">
                    {LOCATION_OF_CORNER_TITLE}
                </Text>
            </Center>

            <Box w="100%" maxWidth="90%" mt="5">
                {longitude.length > 0 ? (
                    <>
                        <Text numberOfLines={14}>
                            {NEXT_LOCATION_MESSAGE}
                        </Text>
                    </>
                ) : (
                    <Text numberOfLines={14}>
                        {FIRST_LOCATION_MESSAGE}
                    </Text>
                )}
            </Box>

            <Box w="100%" maxWidth="75%" mt="5">
                <Button mb="2" onPress={() => { getCurrentPosition(); }}>
                    {GET_CURRENT_LOCATION_LABEL}
                </Button>
                <Button mb="2" onPress={() => { postCoordinates(); }}>
                    {SAVE_UPLOAD_MAP_LABEL}
                </Button>
                <Button mb="2" onPress={() => { navigation.navigate('AccessibilityScreen');}}>
                    {DISCARD_GPS_LOCATIONS_LABEL}
                </Button>
            </Box>
        </>
    )
}

export default GPSCornerSelection;