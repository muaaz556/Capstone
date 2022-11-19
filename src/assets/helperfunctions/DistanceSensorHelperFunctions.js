import {PermissionsAndroid} from 'react-native';

//this function searches and then sets up the bluetooth connection with a device
export function connectAndReceive(bleManager, connectorDevice) {
  //get permission to use phone location (needed for bluetooth)

  const permission = requestLocationPermission();
  //if permission given then continue
  if (permission) {
    //scan for devices
    bleManager.startDeviceScan(
      null,
      {allowDuplicates: false},
      (error, device) => {
        //if error occurs then stop the scan
        if (error) {
          console.log(error.message);
          return;
        }

        //find the device named NanoBLE (this is the name set in the arduino code)
        if (
          device != null &&
          (device.name === 'NanoBLE' || device.localName === 'NanoBLE')
        ) {
          //the device has been found so we stop searching
          bleManager.stopDeviceScan();
          //connect to the device
          device
            .connect()
            .then(
              device => {
                return device.discoverAllServicesAndCharacteristics();
              },
              error => {
                console.log('Failed to connect to NanoBLE');
                return;
              },
            )
            .then(
              device => {
                connectorDevice = device;
                return;
              },
              error => {
                console.log('Failed to find service');
                return;
              },
            );
        }
      },
    );
  }
}

//source: https://stackoverflow.com/questions/55813427/unable-to-use-react-native-bluetoothel
//gets location permission from user so that bluetooth can be used
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission for bluetooth scanning',
        message:
          'Please provide permission in order to connect to the distance sensor',
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
