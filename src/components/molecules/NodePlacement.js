import React, { useContext } from 'react';
import { StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { View } from 'native-base';
import Svg, {Ellipse} from 'react-native-svg';
import { NodePlacementContext } from '../organisms/FourCornerState';

const styles = StyleSheet.create({ 
    touchableOpacity: {
        flex: 0.9,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignSelf: 'flex-start',
    }
});

const NodePlacement = ({photo}) => {

    const {windowH, gestures} = useContext(NodePlacementContext);
    const [gestureLocations, setGestureLocations] = gestures;
    const [windowHState, setWindowHState] = windowH;

    const windowWidth = Dimensions.get('window').width;

    const handleGestureClick = (evt) => {

        let oldXRange = windowWidth*0.9;
        let newXRange = 100;
        let newXValue = (evt.nativeEvent.pageX / oldXRange * newXRange);

        let oldYRange = windowHState;
        let newYRange = 100;
        let newYValue = (evt.nativeEvent.pageY / oldYRange * newYRange) ;

        let gestureItem = {
            x: newXValue,
            y: newYValue,
        };

        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
    };

    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.2"
                ry="1.1"
                stroke="blue"
                fill="blue"
            />
        </View>
    ));

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