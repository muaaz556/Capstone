import React, { useContext, useEffect, useState } from 'react';
import {StyleSheet} from 'react-native';
import {Button, FlatList} from 'native-base';

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
    dividerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 20,
    },
    dividerText: {
        textAlign: 'center',
        color: '#808585',
        paddingHorizontal: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#808585',
    },
  });

const ListItems = ({list, updateStep, titleText}) => {
    return (
        <Box w="100%" maxWidth="75%" mt="5">
            <View style={styles.dividerView}>
                <View style={styles.dividerLine} />
                <View>
                    <Text style={styles.dividerText}>{titleText}</Text>
                </View>
                <View style={styles.dividerLine} />
            </View>
            <FlatList
                data={list}
                renderItem={({item}) => (
                    <>
                        <Button
                        title={item}
                        style={styles.button}
                        onPress={()=> updateStep(item)}>
                            {item}
                        </Button>
                    </>
                )}
            />
        </Box>
    )
};

export default ListItems;
