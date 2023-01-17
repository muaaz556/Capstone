import React from 'react';

import {ActivityIndicator, StyleSheet} from 'react-native';
import {Center, Text, View} from 'native-base';
import { PLEASE_WAIT_MESSAGE } from '../../assets/locale/en';

const styles = StyleSheet.create({
    pleaseWait: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        padding: 10,
    },
});

const PleaseWait = () => {
    return (
        <View style={styles.pleaseWait}>
            <Center>
                <Text fontSize="2xl">
                    {PLEASE_WAIT_MESSAGE}
                </Text>
                <ActivityIndicator style={styles.activityIndicator} size="large" />
            </Center>
        </View>
    )
}

export default PleaseWait;