import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet} from 'react-native';
import {Button, FlatList, Box, View, Text} from 'native-base';

const styles = StyleSheet.create({
    button: {
      marginTop: 10,
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      textAlign: 'center',
      backgroundColor: '#005AB5',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    dividerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 20,
    },
    dividerText: {
        textAlign: 'center',
        color: 'black',
        paddingHorizontal: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    },
  });

const ListItems = ({list, updateStep, titleText}) => {
    return (
        <Box w="100%" maxWidth="100%" mt="5">
            <FlatList
                data={list}
                renderItem={({item}) => (
                    <>
                        <Button
                        title={item}
                        size="lg"
                        mb="4"
                        accessible={true}
                        accessibilityHint={`Select ${item} as ${titleText}`}
                        accessibilityLabel={item}
                        accessibilityRole="button"
                        style={styles.button}
                        onPress={()=> updateStep(item)}>
                            <Text style={styles.buttonText}>{item}</Text>
                        </Button>
                    </>
                )}
            />
        </Box>
    )
};

export default ListItems;
