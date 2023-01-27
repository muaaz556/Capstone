import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { DestinationNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import NodeModal from '../molecules/NodeModal';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, DESTINATION_NODE_STATE, NEXT_TITLE, NEXT_MESSAGE, STATE_NAMES, ENTER_NODE_NAME_TITLE  } from '../../assets/locale/en';
import {Ellipse} from 'react-native-svg';
import Dialog from "react-native-dialog";

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
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [currentGesture, setCurrentGesture] = useState(null);

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.NEXT, BUTTON.BACK];

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
        setStateName(STATE_NAMES.FOUR_CORNER_STATE);
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
        setCurrentGesture(gestureItem);
        setName("");
        setModalVisible(true);
    }

    const modalConfirm = () => {
        console.log(currentGesture);
        currentGesture.name = name;
        console.log(currentGesture);
        setGestureLocations(gestureLocations => [...gestureLocations, currentGesture]);
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
                rx="0.7"
                ry="1.3"
                strokeWidth="0.2"
                stroke="red"
                fill="red"
            />
        </View>
    ));

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }
    
    return ( 
        <>
            <View>
                <Dialog.Container visible={modalVisible}>
                    <Dialog.Title>Set Destination Name</Dialog.Title>
                    <Dialog.Description>
                        Please provide a name for the selected destination.
                    </Dialog.Description>
                    <Dialog.Input onChangeText={(input) => {setName(input)}} value={name} />
                    <Dialog.Button label="Cancel" onPress={() => toggleModal()}/>
                    <Dialog.Button label="Ok" onPress={() => {
                        modalConfirm();
                        toggleModal();
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
