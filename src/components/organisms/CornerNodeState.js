 import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { CornerNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, TOO_MANY_NODES_PLACED, CORNERS_STATE, CLEAR,
     STATE_NAMES, NEXT_TITLE, NEXT_MESSAGE  } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import { getGPSData, postGPSData } from '../../helper-functions/gpsFetching';
import { launchImageLibrary } from 'react-native-image-picker';
import {Ellipse} from 'react-native-svg';

const styles = StyleSheet.create({
    navBarView: {
        flex: 0.16,
      },
});

let getCornerGPSCoords;

const CornerNodeState = ({buildingName, windowH, clearAllNodes, numOfCorners}) => {

    const {state, photoState, cornerNodeGestures} = useContext(CornerNodeStateContext);
    const [stateName, setStateName] = state;
    const [photo, setPhoto] = photoState;
    const [gestureLocations, setGestureLocations] = cornerNodeGestures;

    const listOfButtonNames = [BUTTON.UPLOAD, BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.HELP];

    if (gestureLocations.length > numOfCorners) {
        displayTextAlert(TOO_MANY_NODES_PLACED.TITLE, TOO_MANY_NODES_PLACED.MESSAGE);
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    }

    const mapGesturesToGPS = async () => {
        getCornerGPSCoords = await getGPSData('get-corner-cords', `getType=get-route&buildingName=${buildingName}`);
        for (let i = 0; i < gestureLocations.length; i++) {
            getCornerGPSCoords.cornerCords[i]['x'] = gestureLocations[i].x;
            getCornerGPSCoords.cornerCords[i]['y'] = gestureLocations[i].y;
        }
        const requestData = JSON.stringify({'gpsCornerCord': getCornerGPSCoords});
        postGPSData(requestData, 'post-corner-cords');
    };

    const upload = () => {
        const options = {
            noData: true,
        };

        launchImageLibrary(options, response => {
            if (response.assets && response.assets[0].uri) {
            setPhoto(response.assets[0]);
            clearAllNodes();
            displayTextAlert(CORNERS_STATE.TITLE, CORNERS_STATE.MESSAGE);
            }
        });
    };

    const next = () => {
        displayTwoButtonTextAlert(NEXT_TITLE, NEXT_MESSAGE,
            () => {
                mapGesturesToGPS();
                setStateName(STATE_NAMES.DESTINATION_NODE_STATE);
            }
        );
    };

    const clear = () => {
        displayTwoButtonTextAlert(CLEAR.TITLE, CLEAR.MESSAGE,
            () => {
                setGestureLocations([]);
            }
        );
    };

    const undo = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    };

    const help = () => {
        displayTextAlert(CORNERS_STATE.TITLE, CORNERS_STATE.MESSAGE);
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
    };

    const onPress = (buttonName) => {
        switch (buttonName) {
            case BUTTON.UPLOAD:
                upload();
                break;
            case BUTTON.NEXT:
                next();
                break;
            case BUTTON.CLEAR:
                clear();
                break;
            case BUTTON.UNDO:
                undo();
                break;
            case BUTTON.HELP:
                help();
                break;
            default:
                console.log('invalid button name');

        }
    };

    const isDisabled = (buttonName) => {
        return ( (buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && gestureLocations.length === 0 ) ||
               ( (buttonName === BUTTON.NEXT) && gestureLocations.length < numOfCorners );
    };

    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.7"
                ry="1.3"
                strokeWidth="0.2"
                stroke={NODES.CORNER_NODE}
                fill={NODES.CORNER_NODE}
            />
        </View>
    ));

    console.log(listItems);
    return (
        <>
            <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItems}/>

            <View style={styles.navBarView}>
                <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
            </View>
        </>
    );
};

export default CornerNodeState;
