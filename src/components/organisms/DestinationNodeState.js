import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { DestinationNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, DESTINATION_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE, STATE_NAMES,
        ENTER_NODE_NAME_TITLE, DIALOG  } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import {Ellipse} from 'react-native-svg';
import Dialog from "react-native-dialog";

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.16,
    },
    dialog: {
        color: 'black',
    }
});

const DestinationNodeState = ({windowH, photo}) => {
    
    const {state, destinationGestures} = useContext(DestinationNodeStateContext)
    const [stateName, setStateName] = state;
    const [gestureLocations, setGestureLocations] = destinationGestures;
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [currentGesture, setCurrentGesture] = useState(null);
    const [nodeUnnamed, setNodeUnnamed] = useState(false);

    const listOfButtonNames = [BUTTON.LABEL, BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK, BUTTON.HELP];

    useEffect(() => {
        displayTextAlert(DESTINATION_NODE_STATE.TITLE, DESTINATION_NODE_STATE.MESSAGE);
    }, []);
    
    const next = () => {

        displayTwoButtonTextAlert(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                setStateName(STATE_NAMES.HALLWAY_NODE_STATE);
            }
        );
    }

    const back = () => {
        setStateName(STATE_NAMES.CORNER_NODE_STATE);
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
            displayTextAlert(DESTINATION_NODE_STATE.INVALID_TITLE, DESTINATION_NODE_STATE.INVALID_MESSAGE)
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

    const help = () => {
        displayTextAlert(DESTINATION_NODE_STATE.TITLE, DESTINATION_NODE_STATE.MESSAGE);
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
        return ((buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR || buttonName === BUTTON.NEXT) && gestureLocations.length === 0) || 
                (buttonName === BUTTON.LABEL && !nodeUnnamed) || 
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
                stroke={NODES.DESTINATION_NODE}
                fill={NODES.DESTINATION_NODE}
            />
        </View>
    ));

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }
    
    return ( 
        <>
            <View>
                <Dialog.Container visible={modalVisible} style={styles.dialog}>
                    <Dialog.Title>{DIALOG.DESTINATION_TITLE}</Dialog.Title>
                    <Dialog.Description>
                        {DIALOG.DESTINATION_DESCRIPTION}
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

export default DestinationNodeState;
