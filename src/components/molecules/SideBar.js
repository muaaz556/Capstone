import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, FlatList, View, Text} from 'native-base';
import {SIDEBAR_BUTTONS} from '../../assets/colors/Colors.js';

const styles = StyleSheet.create({
    optionBar: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: SIDEBAR_BUTTONS.BACKGROUND,
      width: "100%",
      paddingVertical: 12,
      marginRight: -4,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
    },
    button: {
        alignItems: 'center',
        backgroundColor: SIDEBAR_BUTTONS.ENABLED,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginVertical: 8,
    },
    disabledButton: {
        alignItems: 'center',
        backgroundColor: SIDEBAR_BUTTONS.DISABLED,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 14,
        marginVertical: 8,
    },
    buttonText: {
        color: SIDEBAR_BUTTONS.ENABLED_TEXT,  
        fontWeight: '500',
        fontSize: 14,
        minWidth: "70%",
        textAlign:"center",
    },
    diabledButtonText: {
        color: SIDEBAR_BUTTONS.DISABLED_TEXT,  
        fontWeight: '500',
        fontSize: 14,
        minWidth: "70%",
        textAlign:"center"
    },
  });

let debugging = false;
const SideBar = ({onPress, isDisabled, listOfButtonNames, stateName}) => {

    return (

        <View style={styles.optionBar}>

            <FlatList
                data={listOfButtonNames}
                renderItem={({item}) => (
                    <>
                        <TouchableOpacity
                        onPress={() => onPress(item)}
                        style={(isDisabled(item)) ? styles.disabledButton : styles.button}
                        disabled={isDisabled(item) ? true : false }
                        >
                        <Text style={(isDisabled(item)) ? styles.diabledButtonText : styles.buttonText}>{item}</Text>
                        </TouchableOpacity>
                    </>
                )}
            />
            { debugging === true ? (
                <Button
                    title="State"
                    onPress={() => {
                        console.log(stateName);
                    }}
                    style={styles.button}>
                    State
                </Button>
            ) : (
                <></>
            )}
        </View>
    );
};

export default SideBar;
