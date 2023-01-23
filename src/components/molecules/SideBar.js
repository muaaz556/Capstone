import React, {useState, useContext, createContext} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {StyleSheet} from 'react-native';
import {Button, View} from 'native-base';
import { displayTextAlert } from '../../helper-functions/textAlert';
import { FOUR_CORNERS_STATE_TITLE, FOUR_CORNERS_STATE_MESSAGE } from '../../assets/locale/en';

let stateNames = ['state1', 'state2', 'state3', 'state4'];

const styles = StyleSheet.create({
    button: {
      marginTop: 10,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    disabledButton: {
      marginTop: 10,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      backgroundColor: 'grey'
    },
    optionBar: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

const SideBar = ({mapGesturesToGPS, SideBarContext, onPressFunctions}) => {

    const {photo, gestures, state} = useContext(SideBarContext);
    const [gestureLocations, setGestureLocations] = gestures;
    const [photoState, setPhotoState] = photo;
    const [stateName, setStateName] = state;


    let choosePhotoHandler = () => {
        onPressFunctions[0]();
    };

    const nextState = () => {
        onPressFunctions[1]();
    };

    const clearAllClicks = () => {
        onPressFunctions[2]();
    }

    const undoRecentClick = () => {
        onPressFunctions[3]();
    }

    const prevState = () => {
        // const stateIndex = stateNames.indexOf(stateName);
        // if(stateIndex == 0) {
        //     console.log("you're on the first state already.");
        // } else {
        //     setStateName(stateNames[(stateIndex - 1)]);
        // }
    };

    return (

        <View style={styles.optionBar}>
            {stateName=='state1' && (
                <>
                    <Button
                        title="Choose Photo"
                        onPress={choosePhotoHandler}
                        style={styles.button}>
                        Upload
                    </Button>
                </>
            )}
            <Button
                title="Undo"
                onPress={undoRecentClick}
                style={gestureLocations.length > 0 ? styles.button : styles.disabledButton}
                disabled={gestureLocations.length > 0 ? false : true}>
                Undo
            </Button>
            <Button
                title="Clear"
                onPress={clearAllClicks}
                style={gestureLocations.length > 0 ? styles.button : styles.disabledButton}
                disabled={gestureLocations.length > 0 ? false : true}>
                Clear
            </Button>
            <Button
                title="Next"
                onPress={() => {
                    nextState();
                }}
                style={styles.button}>
                Next
            </Button>
            <Button
                title="State"
                onPress={() => {
                    console.log(stateName);
                }}
                style={styles.button}>
                State
            </Button>

            {stateName!='state1' && (
                <>
                    <Button
                        title="Back"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        Back
                    </Button>
                </>
            )}

            {stateName=='state3' && (
                <>
                    <Button
                        title="Unselect"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        Unselect
                    </Button>
                </>
            )}

            {stateName=='state3' && (
                <>
                    <Button
                        title="View Text"
                        onPress={() => {
                            prevState();
                        }}
                        style={styles.button}>
                        View Text
                    </Button>
                </>
            )}
        </View>
    )
};

export default SideBar;