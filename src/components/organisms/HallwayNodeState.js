import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { HallwayNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, STATE_NAMES, CLEAR, HALLWAY_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE  } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import {Ellipse} from 'react-native-svg';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.16,
      },
});

const HallwayNodeState = ({windowH, photo}) => {

    const {state, hallwayGestures} = useContext(HallwayNodeStateContext);
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = hallwayGestures;

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK, BUTTON.HELP];

    useEffect(() => {
        displayTextAlert(HALLWAY_NODE_STATE.TITLE, HALLWAY_NODE_STATE.MESSAGE);
    }, []);
    
    const next = () => {
        displayTwoButtonTextAlert(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                setStateName(STATE_NAMES.FLOOR_CHANGING_NODE_STATE);
            }
        );
    }

    const back = () => {
        setStateName(STATE_NAMES.DESTINATION_NODE_STATE);
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

    const help = () => {
        displayTextAlert(HALLWAY_NODE_STATE.TITLE, HALLWAY_NODE_STATE.MESSAGE);
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
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
        return (buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR || buttonName === BUTTON.NEXT) && gestureLocations.length === 0;
    }
    
    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.7"
                ry="1.3"
                strokeWidth="0.2"
                stroke={NODES.HALLWAY_NODE}
                fill={NODES.HALLWAY_NODE}
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

export default HallwayNodeState;
