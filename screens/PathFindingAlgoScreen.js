
import {Button} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { runTest } from '../src/main.js';



const PathFindingAlgoScreen = ({ navigation }) => {

    const test = (num) => {
        var path = runTest(num);
        console.log("path: " + path);
        // navigation.navigate("TTS");
    }

    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Button
                onPress={ () => { test(1); } }
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text style={{color: "#FFFFFF"}}>Run Test 1</Text>
            </Button>
            <Button
                onPress={ () => { test(2); } }
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text style={{color: "#FFFFFF"}}>Run Test 2</Text>
            </Button>
            <Button
                onPress={ () => { test(3); } }
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text style={{color: "#FFFFFF"}}>Run Test 3</Text>
            </Button>
        </View>

    );
  };

  export default PathFindingAlgoScreen;