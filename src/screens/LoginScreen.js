import React, { useEffect } from 'react';

import { 
    Text, 
    View, 
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    view: {
        lex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    text: {
        color: 'black'
    }
  });

const LoginScreen = () => {
    return (
        <View style={styles.view}>
            <Text style={styles.text}>Home Screen</Text>
        </View>
    )
}

export default LoginScreen;