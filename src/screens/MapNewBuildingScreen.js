import React, { createContext } from 'react';
import {useState} from 'react';

import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import {postGPSData} from '../helper-functions/gpsFetching';
import Overview from '../components/organisms/Overview';
import BuildingNameInput from '../components/organisms/BuildingNameInput';
import GPSCornerSelection from '../components/organisms/GPSCornerSelection';
import PleaseWait from '../components/molecules/PleaseWait';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
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
  pleaseWait: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    padding: 10,
  },
});

export const OverviewContext = createContext();
export const BuildingNameInputContext = createContext();
export const GPSCornerSelectionContext = createContext();

const MapNewBuildingScreen = ({navigation}) => {
  const [stepNumber, setStepNumber] = useState(0);
  const [buildingName, setBuildingName] = useState('');

  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);

  const [stepName, setStepName] = useState('overview');

  const postCoordinates = () => {
    let cornerCoordinates = []

    for (let i = 0; i < longitude.length; i++) {
      cornerCoordinates.push({long: longitude[i], lat: latitude[i]})
    }

    const requestData = JSON.stringify({
      gpsCornerCord: [
        {
          buildingName: buildingName,
          cornerCords: {
            cornerCords: cornerCoordinates,
          },
        },
      ],
    });

    postGPSData(requestData, 'post-corner-cords').then(() =>
      navigation.navigate('AccessibilityScreen'),
    );
  };

  return (
    <View style={styles.view}>
      {stepName === 'overview' ? (
        <OverviewContext.Provider value={{ stepName, setStepName }}>
          <Overview />
        </OverviewContext.Provider>
      ) : stepName === 'building_name' ? (
        <BuildingNameInputContext.Provider value={{ buildingName: [buildingName, setBuildingName], stepName: [stepName, setStepName]}}>
          <BuildingNameInput/>
        </BuildingNameInputContext.Provider>
      ) : stepName === 'gps_call' ? (
        <GPSCornerSelectionContext.Provider value={{
          long: [longitude, setLongitude],
          lat: [latitude, setLatitude],
          step: [stepName, setStepName],
          postFunction: [postCoordinates]
        }}>
          <GPSCornerSelection navigation={navigation}/>
        </GPSCornerSelectionContext.Provider>
      ) : stepName === 'please_wait' ? (
        <PleaseWait/>
      ) : (
        <></>
      )}
    </View>
  )
};

export default MapNewBuildingScreen;
