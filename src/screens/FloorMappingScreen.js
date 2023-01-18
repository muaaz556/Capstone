/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Button, View} from 'native-base';
import Svg, {Circle} from 'react-native-svg';

const styles = StyleSheet.create({
  button: {
    marginTop: 10
  },

  touchableOpacity: {
    flex: 1,
    width: '110%',
    height: '100%',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  optionBar : {
    flex: 0.1,
    alignItems: 'center',
    backgroundColor: 'grey'}
});

const FloorMappingScreen = () => {
  // stores photo resource
  const [photo, setPhoto] = useState(null);

  // event handler for choosing photo
  let choosePhotoHandler = () => {
    const options = {
      noData: true,
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets[0].uri) {
        setPhoto(response.assets[0]);
        setGestureLocations([]);
      }
    });
  };

  const [gestureLocations, setGestureLocations] = useState([]);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleGestureClick = (evt) => {

    let oldXRange = windowWidth;
    let newXRange = 100;
    let newXValue = (evt.nativeEvent.pageX / oldXRange * newXRange);

    let oldYRange = windowHeight;
    let newYRange = 100;
    let newYValue = (evt.nativeEvent.pageY / oldYRange * newYRange) ;

    let gestureItem = {
      x: newXValue,
      y: newYValue,
    };

    setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
  };

  const undoRecentClick = () => {
    setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
  }

  const clearAllClicks = () => {
    setGestureLocations([])
  }

  const listItems = gestureLocations.map((item, key) => (
    <View key={key}>
      <Circle
        cx={item.x}
        cy={item.y}
        r="1"
        stroke="blue"
        fill="blue"
      />
    </View>
  ));

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 0.9, alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          activeOpacity={1}
          onPress={evt => handleGestureClick(evt)}>
          {photo && (
            <>
              <Image
                position="absolute"
                zIndex={10}
                source={{uri: photo.uri}}
                alt={'Alternative Image text'}
                resizeMode="contain"
                style={{width: '100%', height: '100%'}}
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
        </TouchableOpacity>
      </View>
      <View style={styles.optionBar}>
        <Button
          title="Choose Photo"
          onPress={choosePhotoHandler}
          style={styles.button}>
          Add Photo
        </Button>
        <Button
          title="Undo"
          onPress={undoRecentClick}
          style={styles.button}>
          Undo
        </Button>
        <Button
          title="Clear"
          onPress={clearAllClicks}
          style={styles.button}>
          Clear
        </Button>
      </View>
    </View>
  );
};

export default FloorMappingScreen;
