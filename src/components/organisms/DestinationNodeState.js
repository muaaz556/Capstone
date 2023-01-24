import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { DestinationNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTextAlertClear, displayTextAlertNext } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, DESTINATION_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE, STATE_NAMES  } from '../../assets/locale/en';
import {Ellipse} from 'react-native-svg';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});

const DestinationNodeState = ({windowH, photo}) => {
    
    const {state, destinationGestures} = useContext(DestinationNodeStateContext)
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = destinationGestures;

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK];

    useEffect(() => {
        displayTextAlert(DESTINATION_NODE_STATE.TITLE, DESTINATION_NODE_STATE.MESSAGE);
    }, []);
    
    const next = () => {
        console.log("next function");
        displayTextAlertNext(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                //STUFF to do before moving to next state
                setStateName(STATE_NAMES.HALLWAY_NODE_STATE);
            }
        );
    }

    const back = () => {
        console.log("back function");
        setStateName(STATE_NAMES.FOUR_CORNER_STATE);
    }

    const clear = () => {
        console.log("clear function invoked");
        displayTextAlertClear(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                console.log("clear function called");
                setGestureLocations([]);
            }
        );
    }

    const undo = () => {
        console.log("undo function");
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
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
                rx="0.2"
                ry="1.1"
                stroke="red"
                fill="red"
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

export default DestinationNodeState;
