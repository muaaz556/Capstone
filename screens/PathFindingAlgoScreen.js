
import {Button} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { runTest } from '../src/main.mjs';



const PathFindingAlgoScreen = ({ navigation }) => {

    var [state, setState] = useState("Not connected");

    const test = (num) => {
        runTest(num);
    }

    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Sample text</Text>
            <Button
                onPress={test}
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text>Run Test 1</Text>
            </Button>
            <Button
                onPress={test}
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text>Run Test 2</Text>
            </Button>
            <Button
                onPress={test}
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text>Run Test 3</Text>
            </Button>
        </View>

    );
  };

  export default PathFindingAlgoScreen;