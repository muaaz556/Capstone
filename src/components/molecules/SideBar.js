import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, FlatList, View} from 'native-base';

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

let debugging = false;
const SideBar = ({onPress, isDisabled, listOfButtonNames, stateName}) => {

    return (

        <View style={styles.optionBar}>

            <FlatList
                data={listOfButtonNames}
                renderItem={({item}) => (
                    <>
                        <Button
                            title={item}
                            onPress={() => onPress(item)}
                            style={(isDisabled(item)) ? styles.disabledButton : styles.button }
                            disabled={isDisabled(item) ? true : false }>
                            {item}
                        </Button>
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
