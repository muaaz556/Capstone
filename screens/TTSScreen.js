import React from 'react';
import {Button} from 'native-base';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import * as Speech from 'expo-speech'
const TTSScreen = ({ navigation }) => {
    const [text, handleTextChange] = React.useState("In 5 metres turn left");

    const getTTS = () => {
        Speech.speak(text);
    }

    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <TextInput
                value={text}
                onChangeText={handleTextChange}
            />
            <Button
                onPress={getTTS}
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text>TTS</Text>
            </Button>
        </View>

    );
  };

  export default TTSScreen;