import React, {useState, createContext} from 'react';
import {StyleSheet} from 'react-native';
import {Button, View} from 'native-base';
import { displayTextAlert } from '../helper-functions/textAlert';
import FourCornerState from '../components/organisms/FourCornerState';

export const FourCornerStateContext = createContext();

const FloorMappingScreen = ({route}) => {

  const [windowH, setWindowH] = useState(0);
  const [stateName, setStateName] = useState('state1');

  const onLayout = (event) => {
    if (event.nativeEvent.layout.height < event.nativeEvent.layout.width) {
        setWindowH(event.nativeEvent.layout.height)
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row' }} onLayout={( (event) => { onLayout(event) } )}>
      {stateName === 'state1' ? (
        //initial state component
        <>
          <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState buildingName={route.params.buildingName}/>
          </FourCornerStateContext.Provider>
        </>
      ) : stateName === 'state2' ? (
        <>
          {/* These are placeholders */}
          {/* <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider> */}
        </>
      ) : stateName === 'state3' ? (
        <>
          {/* These are placeholders */}
          {/* <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider> */}
        </>
      ) : stateName === 'state4' ? (
        <>
          {/* These are placeholders */}
          {/* <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider> */}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default FloorMappingScreen;
