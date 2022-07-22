import {Button} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech'

const HomeScreen = ({ navigation }) => {
    const navigateWithTTS = (destination, text) => {
        Speech.speak(text);
        navigation.navigate(destination)
    }

    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Button 
            onPress={() =>
                navigateWithTTS('Distance',"Entering Distance Sensor Demo Page")
            }
            style={{width:250,height: 100, backgroundColor:'#99004d',marginTop:20, borderRadius:20}}>
                    <Text style={{color: "#FFFFFF", fontSize:20, fontWeight:'bold'}}>Object Sensing Screen</Text>
            </Button>
            <Button
                onPress={() =>
                    navigateWithTTS('TTS',"Entering Text-to-Speech Demo Page")
                }
                style={{width:250,height: 100, backgroundColor:'#99004d',marginTop:20, borderRadius:20}}>
                <Text style={{color: "#FFFFFF", fontSize:20, fontWeight:'bold'}}>Text-to-Speech Screen</Text>
            </Button>
            <Button
                onPress={() =>
                    navigation.navigate('PathFinding')
                }
                style={{width:250,height: 100, backgroundColor:'#99004d',marginTop:20, borderRadius:20}}>
                <Text style={{textAlign: 'center', color: "#FFFFFF", fontSize:20, fontWeight:'bold'}}>Path-Finding Algorithm Screen</Text>
            </Button>

            <Button
                onPress={() =>
                    navigation.navigate('Location')
                }
                style={{width:250,height: 100, backgroundColor:'#99004d',marginTop:20, borderRadius:20}}>
                <Text style={{color: "#FFFFFF", fontSize:20, fontWeight:'bold'}}>Location Screen</Text>
            </Button>
        </View>
    );
  };

  export default HomeScreen;