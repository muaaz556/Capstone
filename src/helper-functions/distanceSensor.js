import {PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {NANO_BLE, BLUETOOTH_PERMISSION} from '../assets/locale/en';

const bleManager = new BleManager();

//this function searches and then sets up the bluetooth connection with a device
export function connectAndReceive(updateDevice) {
  updateDevice(null, true);

  //get permission to use phone location (needed for bluetooth)
  const permission = requestLocationPermission().then(permission => {
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
            (device.name === NANO_BLE || device.localName === NANO_BLE)
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
                  updateDevice(device, false);
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
  });
}

//this function searches and then sets up the bluetooth connection with a device
//source: https://stackoverflow.com/questions/55813427/unable-to-use-react-native-bluetoothel
//gets location permission from user so that bluetooth can be used
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: BLUETOOTH_PERMISSION.TITLE,
        message: BLUETOOTH_PERMISSION.MESSAGE,
        buttonNeutral: BLUETOOTH_PERMISSION.ASK_LATER,
        buttonNegative: BLUETOOTH_PERMISSION.CANCEL,
        buttonPositive: BLUETOOTH_PERMISSION.OK,
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
