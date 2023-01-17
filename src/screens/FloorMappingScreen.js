/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Box, Button, Center, Text, View} from 'native-base';
import Svg, {Circle} from 'react-native-svg';

const styles = StyleSheet.create({});

let imageWidth = -1;
let imageHeight = -1;

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
        console.log(response.assets[0]);
        setPhoto(response.assets[0]);
        imageWidth = response.assets[0].width;
        imageHeight = response.assets[0].height;
      }
    });
  };

  const [gestureLocations, setGestureLocations] = useState([]);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handleGestureClick = evt => {
    console.log('X : ', evt.nativeEvent.locationX);
    console.log('Y : ', evt.nativeEvent.locationY);

    let oldXRange = imageWidth;
    let newXRange = 100;
    let newXValue = (evt.nativeEvent.locationX * newXRange) / oldXRange;

    let oldYRange = imageHeight;
    let newYRange = 100;
    let newYValue = (evt.nativeEvent.locationY * newYRange) / oldYRange;

    let gestureItem = {
      x: newXValue,
      y: newYValue,
    };

    console.log('gestureLocation: ', gestureLocations);
    console.log('imageWidth: ', imageWidth);
    console.log('imageHeight: ', imageHeight);

    setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
  };

  const listItems = gestureLocations.map((item, key) => (
    <>
      <Circle
        key={key}
        cx={item.x}
        cy={item.y}
        r="1"
        stroke="blue"
        fill="green"
      />
    </>
  ));

  return (
    // <View style={styles.view} height="100%">
    //     {/* <Center>
    //         <Text fontSize="2xl">
    //             Mapping Page
    //         </Text>
    //     </Center> */}
    //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //         {photo && (
    //             <Image
    //                 source={{ uri: photo.uri }}
    //                 style={{ width: '100%', height: '100%' }}
    //             />
    //         )}
    //         <Button title="Choose Photo" onPress={choosePhotoHandler} />
    //     </View>
    //     {/* <View>
    //         <Box bg="primary.400" borderRadius="5" rounded="md" height="70%" width="20%" mt="10">
    //             <Text color="white">Option 1</Text>
    //             <Text color="white">Option 2</Text>
    //             <Text color="white">Option 3</Text>
    //         </Box>
    //     </View> */}
    // </View>

    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 0.9, alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            flex: 1,
            borderColor: 'black',
            borderWidth: 1,
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={evt => handleGestureClick(evt)}>
          {photo && (
            <>
              <Image
                position="absolute"
                zIndex={10}
                source={{uri: photo.uri}}
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
      <View style={{flex: 0.1, alignItems: 'center', backgroundColor: 'grey'}}>
        <Button
          title="Choose Photo"
          onPress={choosePhotoHandler}
          style={{marginTop: 10}}>
          Add Photo
        </Button>
      </View>
    </View>
  );
};

export default FloorMappingScreen;
