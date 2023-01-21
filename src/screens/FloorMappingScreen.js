/* eslint-disable prettier/prettier */
import React, {useState, useContext, createContext} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Button, View} from 'native-base';
import Svg, {Ellipse} from 'react-native-svg';
import { displayTextAlert } from '../helper-functions/textAlert';
import { FOUR_CORNERS_STATE_TITLE, FOUR_CORNERS_STATE_MESSAGE } from '../assets/locale/en';
import NodePlacement from '../components/organisms/NodePlacement';

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  disabledButton: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    backgroundColor: 'grey'
  },

  touchableOpacity: {
    flex: 0.9,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  navBarView: {
    flex: 0.1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderLeftWidth: 5,
  },

  optionBar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export const NodePlacementContext = createContext();

const FloorMappingScreen = () => {
  // stores photo resource
  
  const [photo, setPhoto] = useState(null);
  const [gestureLocations, setGestureLocations] = useState([]);
  const [windowH, setWindowH] = useState(0);

  // event handler for choosing photo
  let choosePhotoHandler = () => {
    const options = {
      noData: true,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0].uri) {
        setPhoto(response.assets[0]);
        setGestureLocations([]);
        displayTextAlert(FOUR_CORNERS_STATE_TITLE, FOUR_CORNERS_STATE_MESSAGE);
      }
    });
  };

  // const [gestureLocations, setGestureLocations] = useState([]);
  // const [windowH, setWindowH] = useState(0);

  // const windowWidth = Dimensions.get('window').width;

  // const handleGestureClick = (evt) => {

  //   let oldXRange = windowWidth*0.9;
  //   let newXRange = 100;
  //   let newXValue = (evt.nativeEvent.pageX / oldXRange * newXRange);

  //   let oldYRange = windowH;
  //   let newYRange = 100;
  //   let newYValue = (evt.nativeEvent.pageY / oldYRange * newYRange) ;

  //   let gestureItem = {
  //     x: newXValue,
  //     y: newYValue,
  //   };

  //   setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
  // };

  const undoRecentClick = () => {
    setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
  }

  const clearAllClicks = () => {
    setGestureLocations([])
  }

  const onLayout = (event) => {
  if (event.nativeEvent.layout.height < event.nativeEvent.layout.width) {
      setWindowH(event.nativeEvent.layout.height)
  }
}

  return (
    <View style={{ flex: 1, flexDirection: 'row' }} onLayout={( (event) => { onLayout(event) } )}>
      {/* <TouchableOpacity
        style={styles.touchableOpacity}
        activeOpacity={1}
        onPress={evt => handleGestureClick(evt)}>
          {photo && (
            <>
              <Image
                position="absolute"
                zIndex={10}
                source={{ uri: photo.uri }}
                alt={'Alternative Image text'}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
              <Svg
                zIndex={100}
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none">
                {listItems}
              </Svg>
            </>
          )}
      </TouchableOpacity> */}
      <NodePlacementContext.Provider value={{ windowH: [windowH, setWindowH], gestureLocations: [gestureLocations, setGestureLocations], }}>
        <NodePlacement photo={photo}/>
      </NodePlacementContext.Provider>
      
      <View style={styles.navBarView}>
        <View style={styles.optionBar}>
          <Button
            title="Choose Photo"
            onPress={choosePhotoHandler}
            style={styles.button}>
            Upload
          </Button>
          <Button
            title="Undo"
            onPress={undoRecentClick}
            style={gestureLocations.length > 0 ? styles.button : styles.disabledButton}
            disabled={gestureLocations.length > 0 ? false : true}>
            Undo
          </Button>
          <Button
            title="Clear"
            onPress={clearAllClicks}
            style={gestureLocations.length > 0 ? styles.button : styles.disabledButton}
            disabled={gestureLocations.length > 0 ? false : true}>
            Clear
          </Button>
          <Button
            title="Save"
            onPress={() => {}}
            style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </View>
  );
};

export default FloorMappingScreen;
