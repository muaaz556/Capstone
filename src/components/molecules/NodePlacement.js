import React, { useContext } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { View } from 'native-base';
import Svg from 'react-native-svg';
import uuid from 'react-native-uuid';

const styles = StyleSheet.create({ 
    touchableOpacity: {
        flex: 0.84,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignSelf: 'flex-start',
    }
});

const NodePlacement = ({photo, windowH, updateGesture, listItems}) => {

    const windowWidth = Dimensions.get('window').width;

    const handleGestureClick = (evt) => {

        let oldXRange = windowWidth*0.84;
        let newXRange = 100;
        let newXValue = (evt.nativeEvent.pageX / oldXRange * newXRange);

        let oldYRange = windowH;
        let newYRange = 100;
        let newYValue = (evt.nativeEvent.pageY / oldYRange * newYRange) ;

        let gestureItem = {
            x: newXValue,
            y: newYValue,
            guid: uuid.v4(),
            adjacencyList: [],
            name: "",
        };

        updateGesture(gestureItem);
    };

   return ( 
    <>
        <TouchableOpacity
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
        </TouchableOpacity> 
    </>
  )
}

export default NodePlacement;