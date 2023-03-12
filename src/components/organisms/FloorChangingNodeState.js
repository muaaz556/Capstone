import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { FloorChangingNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, FLOOR_CHANGING_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE, STATE_NAMES } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import {Ellipse} from 'react-native-svg';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.16,
      },
});

const FloorChangingNodeState = ({windowH, photo}) => {

    const {state, floorChangingGestures} = useContext(FloorChangingNodeStateContext);
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = floorChangingGestures;

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK, BUTTON.HELP];

    useEffect(() => {
        displayTextAlert(FLOOR_CHANGING_NODE_STATE.TITLE, FLOOR_CHANGING_NODE_STATE.MESSAGE);
    }, []);
    
    const next = () => {
        displayTwoButtonTextAlert(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                setStateName(STATE_NAMES.BATHROOM_NODE_STATE);
            }
        ); 
    }

    const back = () => {
        setStateName(STATE_NAMES.HALLWAY_NODE_STATE);
    }

    const clear = () => {
        displayTwoButtonTextAlert(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                setGestureLocations([]);
            }
        );
    }

    const undo = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))  
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
    }

    const help = () => {
        displayTextAlert(FLOOR_CHANGING_NODE_STATE.TITLE, FLOOR_CHANGING_NODE_STATE.MESSAGE);
    }

    const onPress = (buttonName) => {
        switch (buttonName) {
            case BUTTON.NEXT:
                next();
                break;
            case BUTTON.CLEAR:
                clear();
                break;
            case BUTTON.UNDO:
                undo();
                break;
            case BUTTON.BACK:
                back();
                break;
            case BUTTON.HELP:
                help();
                break;
            default:
                console.log("invalid button name");

        }
    }
    
    const isDisabled = (buttonName) => {
        return (buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && gestureLocations.length === 0;
    }
    
    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.7"
                ry="1.3"
                strokeWidth="0.2"
                stroke={NODES.FLOOR_CHANGING_NODE}
                fill={NODES.FLOOR_CHANGING_NODE}
            />
        </View>
    ));
    
    return ( 
        <>
            <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItems}/>

            <View style={styles.navBarView}>
                <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
            </View>
        </>
    );
};

export default FloorChangingNodeState;
