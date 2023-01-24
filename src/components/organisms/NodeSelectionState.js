import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { NodeSelectionStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTextAlertClear, displayTextAlertNext } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, NODE_SELECTION_STATE, NEXT_TITLE, NEXT_MESSAGE } from '../../assets/locale/en';
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

const NodeSelectionState = ({windowH, photo}) => {

    const {stateName, setStateName} = useContext(NodeSelectionStateContext);
    const [gestureLocations, setGestureLocations] = useState([]);

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.UNSELECT, BUTTON.VIEW_TEXT, BUTTON.NEXT, BUTTON.BACK];

    useEffect(() => {
        displayTextAlert(NODE_SELECTION_STATE.TITLE, NODE_SELECTION_STATE.MESSAGE);
    }, []);
    
    const next = () => {
        console.log("next function");
        displayTextAlertNext(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                //STUFF to do before moving to next state
                setStateName(STATE_NAMES.NODE_SELECTION_STATE);
            }
        );
    }

    const back = () => {
        console.log("back function");
        setStateName(STATE_NAMES.BATHROOM_NODE_STATE);
    }

    const clear = () => {
        console.log("clear function invoked");
        displayTextAlertClear(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                setGestureLocations([]);
                console.log("clear function called");
            }
        );
    }

    const undo = () => {
        console.log("undo function");
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    }

    const unselect = () => {
        // unselect a node (clear the variable)
        console.log("unselect function");
    }

    const viewText = () => {
        // create a text alert for showing text for node selected
        console.log("view text function");
    }

    const updateGesture = (gestureItem) => {
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
        
        //on click of the screen

        //select a node
        //set a variable which stores the currently selected node

        //OR

        //if a node is currently selected, create a connection between the selected node and 
        //the closest node to the current click (if the closest click is the current selected node, do nothing)
        //if successfull, unselect the currently selected node
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
            case BUTTON.VIEW_TEXT:
                viewText();
                break;
            case BUTTON.UNSELECT:
                unselect();
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
                stroke="#FFC0CB"
                fill="#FFC0CB"
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

export default NodeSelectionState;
