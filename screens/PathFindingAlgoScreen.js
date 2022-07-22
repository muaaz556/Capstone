
import {Button} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { runTest } from '../assets/main.js';

const PathFindingAlgoScreen = ({ navigation }) => {

    const test = (num) => {
        var path = runTest(num);
        console.log("path: " + path);
        switch (num) {
            case 1:
                navigation.navigate("PathDiagram", { searchPath: path, imagePath: require('../assets/test_diagram1.png') });
                break;
            case 2:
                navigation.navigate("PathDiagram", { searchPath: path, imagePath: require('../assets/test_diagram2.png') });
                break;
            case 3:
                navigation.navigate("PathDiagram", { searchPath: path, imagePath: require('../assets/test_diagram3.png') });
                break;
            default:
                navigation.navigate("PathDiagram", { searchPath: path, imagePath: require('../assets/test_diagram1.png') });
        }
        
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