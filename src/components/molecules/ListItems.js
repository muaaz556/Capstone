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
  });

const ListItems = ({list, updateState}) => {
    return (
        <FlatList
            data={list}
            renderItem={({item}) => (
                <>
                    <Button
                    title={item}
                    style={styles.button}
                    onPress={()=> updateState(item)}>
                        {item}
                    </Button>
                </>
            )}
        />
    )
};

export default ListItems;
