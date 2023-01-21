import React, {useState, createContext} from 'react';
import {StyleSheet} from 'react-native';
import {Button, View} from 'native-base';
import { displayTextAlert } from '../helper-functions/textAlert';
import FourCornerState from '../components/organisms/FourCornerState';

export const FourCornerStateContext = createContext();

const styles = StyleSheet.create({
  navBarView: {
    flex: 0.1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderLeftWidth: 5,
  },
});

const FloorMappingScreen = () => {
  // stores photo resource
  
 
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
            <FourCornerState/>
          </FourCornerStateContext.Provider>
        </>
      ) : stateName === 'state2' ? (
        <>
          <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider>
          {/* <NodePlacementContext.Provider value={{ windowH: [windowH, setWindowH], gestureLocations: [gestureLocations, setGestureLocations] }}>
            <NodePlacement photo={photo}/>
          </NodePlacementContext.Provider>

          <View style={styles.navBarView}>
            <StateBarContext.Provider value={{photo: [photo, setPhoto], gestureLocations: [gestureLocations, setGestureLocations], state: [stateName, setStateName]}}>
              <StateBar/>
            </StateBarContext.Provider>
          </View> */}
        </>
      ) : stateName === 'state3' ? (
        <>
          <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider>
        </>
      ) : stateName === 'state4' ? (
        <>
          <FourCornerStateContext.Provider value={{ 
            windowHeight: [windowH, setWindowH], 
            state: [stateName, setStateName],
            }}>
            <FourCornerState/>
          </FourCornerStateContext.Provider>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default FloorMappingScreen;
