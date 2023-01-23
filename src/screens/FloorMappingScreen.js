import React, {useState, createContext} from 'react';
import {StyleSheet} from 'react-native';
import {Button, View} from 'native-base';
import { displayTextAlert } from '../helper-functions/textAlert';
import FourCornerState from '../components/organisms/FourCornerState';
import DestinationNodeState from '../components/organisms/DestinationNodeState';

export const FourCornerStateContext = createContext();
export const DestinationNodeStateContext = createContext();

const FloorMappingScreen = ({route}) => {

  const [windowH, setWindowH] = useState(0);
  const [stateName, setStateName] = useState('state1');
  const [photo, setPhoto] = useState(null);

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
            state: [stateName, setStateName],
            photoState: [photo, setPhoto]
            }}>
            <FourCornerState buildingName={route.params.buildingName} windowH={windowH} />
          </FourCornerStateContext.Provider>
        </>
      ) : stateName === 'state2' ? (
        <>
          <DestinationNodeStateContext.Provider value={{ 
            state: [stateName, setStateName],
            photoState: [photo, setPhoto]
            }}>
            <DestinationNodeState windowH={windowH} />
          </DestinationNodeStateContext.Provider>
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
