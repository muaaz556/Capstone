import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { BathroomNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, STATE_NAMES, CLEAR, BATHROOM_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE, DIALOG  } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import {Ellipse} from 'react-native-svg';
import Dialog from "react-native-dialog";


const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.16,
      },
});

const BathroomNodeState = ({windowH, photo}) => {

    const {state, bathroomGestures} = useContext(BathroomNodeStateContext);
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = bathroomGestures;
    const [nodeUnnamed, setNodeUnnamed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentGesture, setCurrentGesture] = useState(null);
    const [name, setName] = useState("");

    const listOfButtonNames = [BUTTON.LABEL, BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK, BUTTON.HELP];

    useEffect(() => {
        displayTextAlert(BATHROOM_NODE_STATE.TITLE, BATHROOM_NODE_STATE.MESSAGE);
    }, []);
    
    const next = () => {
        displayTwoButtonTextAlert(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                setStateName(STATE_NAMES.NODE_SELECTION_STATE);
            }
        );
    }

    const back = () => {
        setStateName(STATE_NAMES.FLOOR_CHANGING_NODE_STATE);
    }

    const clear = () => {
        displayTwoButtonTextAlert(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                setGestureLocations([]);
                setNodeUnnamed(false);
            }
        );
    }

    const undo = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
        setNodeUnnamed(false);
    }

    const updateGesture = (gestureItem) => {
        
        if (nodeUnnamed) {
            displayTextAlert(BATHROOM_NODE_STATE.INVALID_TITLE, BATHROOM_NODE_STATE.INVALID_MESSAGE)
            return
        }
        setCurrentGesture(gestureItem);
        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem]);
        setNodeUnnamed(true);
    }
    
    const modalConfirm = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
        currentGesture.name = name;
        setGestureLocations(gestureLocations => [...gestureLocations, currentGesture]);
    }

    const label = () => {
        setName("");
        setModalVisible(true);
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    const help = () => {
        displayTextAlert(BATHROOM_NODE_STATE.TITLE, BATHROOM_NODE_STATE.MESSAGE);
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
            case BUTTON.LABEL:
                label();
                break;
            case BUTTON.HELP:
                help();
                break;
            default:
                console.log("invalid button name");

        }
    }
    
    const isDisabled = (buttonName) => {
        return  ((buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && gestureLocations.length === 0 ) || 
                ( buttonName === BUTTON.LABEL && !nodeUnnamed) || 
                ((buttonName === BUTTON.NEXT || buttonName === BUTTON.BACK) && nodeUnnamed);
    }
    
    const listItems = gestureLocations.map((item, key) => (
        <View key={key}>
            <Ellipse
                cx={item.x}
                cy={item.y}
                rx="0.7"
                ry="1.3"
                strokeWidth="0.2"
                stroke={NODES.BATHROOM_NODE}
                fill={NODES.BATHROOM_NODE}
            />
        </View>
    ));
    
    return ( 
        <>
            <View> 
                <Dialog.Container visible={modalVisible}>
                    <Dialog.Title>{DIALOG.BATHROOM_TITLE}</Dialog.Title>
                    <Dialog.Description>
                        {DIALOG.BATHROOM_DESCRIPTION}
                    </Dialog.Description>
                    <Dialog.Input onChangeText={(input) => {setName(input)}} value={name} />
                    <Dialog.Button label="Cancel" onPress={() => toggleModal()}/>
                    <Dialog.Button label="Ok" onPress={() => {
                        modalConfirm();
                        toggleModal();
                        setNodeUnnamed(false);
                        }}/>
                </Dialog.Container>
            </View>
            <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItems}/>

            <View style={styles.navBarView}>
                <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
            </View>
        </>
    );
};

export default BathroomNodeState;
