import React, { useState, useEffect } from 'react';
import { Text, View, Vibration, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64'
import { Button } from 'native-base';

const bleManager = new BleManager();

const DistanceSensingScreen = ({ navigation }) => {
    
    var [state, setState] = useState("Not connected");
    //this variable holds the connected bluetooth device info
    var connectorDevice = null;
    var distanceValue = 0;

    //source: https://stackoverflow.com/questions/55813427/unable-to-use-react-native-bluetoothel
    async function requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: 'Location permission for bluetooth scanning',
                    message: 'wahtever',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            ); 
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }

    //this function searches and then sets up the bluetooth connection with a device
    connectAndReceive = () => {
        //get permission to use phone location (needed for bluetooth)
        const permission = requestLocationPermission();
        //if permission given then continue
        if (permission) {
            //scan for devices
            bleManager.startDeviceScan(null, {allowDuplicates: false, }, (error, device) => {
            //if error occurs then stop the scan
            if (error) {
                console.log(error.message)
                return
            }
            //find the device named NanoBLE (this is the name set in the arduino code)
            if (device != null && (device.name === 'NanoBLE' || device.localName === 'NanoBLE')) {
                //the device has been found so we stop searching
                bleManager.stopDeviceScan();
                //connect to the device
                device.connect()
                .then((device) => {
                    return device.discoverAllServicesAndCharacteristics()
                }, (error) => {
                    console.log("Failed to connect to NanoBLE")
                    return
                })
                .then((device) => {
                    connectorDevice = device
                    return
                }, (error) => {
                    console.log("Failed to find service")
                    return
            })
            }
        })
        }
    };


    useEffect(() => {
        //This function runs every 0.5 seconds.
        //The job of this function is to read data
        //when connected to the bluetooth device every 0.5 seconds. 
        //When not connected this function does nothing (in this 
        //case connectorDevice is null).
        const interval = setInterval(() => {

        if(connectorDevice == null) {
            return
        }
        //The service and characteristic UUID is set in the arduino code
        connectorDevice.readCharacteristicForService("19b10000-e8f2-537e-4f6c-d104768a1214", "1A3AC131-31EF-758B-BC51-54A61958EF82")
        .then((characteristic) => {
            //convert the received data in base64 (basically if not decoded the data looks like random stuff)
            console.log(base64.decode(characteristic.value))
            setState(base64.decode(characteristic.value)+"cm")
            distanceValue = parseInt(base64.decode(characteristic.value))
            //if the distance is less than 100cm then make the phone vibrate
            if(distanceValue < 100) Vibration.vibrate(100)
                return
        }, (error) => {
            console.log(connectorDevice)
            console.log(error)
            console.log("Failed to read characteristic")
            return
        })
        }, 500);
        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        //This function runs every 5 seconds
        //connectorDevice is null when not connected to a bluetooth device
        //the job of this function is to try to connect to a bluetooth device
        //every 5 seconds. When connected this function does nothing.
        const interval = setInterval(() => {
        
        if(connectorDevice != null) {
            clearInterval(interval);
        } else {
            console.log("Trying to connect to device")
            connectAndReceive()
        }
        
        }, 5000);
        return () => clearInterval(interval);
    }, [])


        return (
            <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
                <Text>
                    {"Distance Reading: "}
                    {state}
                </Text>

                {/* <Button onPress={() =>
                    {
                        if(connectorDevice != null){
                             connectorDevice.cancelConnection().then(navigation.navigate('Home'))
                        } else {
                            navigation.navigate('Home')
                        }
                    }
                }><Text>Disconnect and go back</Text></Button> */}
            </View>
        
        );
    };

  export default DistanceSensingScreen;