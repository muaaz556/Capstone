
import {Button} from 'native-base';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Speech from 'expo-speech'

const PathDiagramScreen = ({ navigation, route }) => {

    const getTTS = (text) => {
        Speech.speak(text);
    }

    // const delay = ms => new Promise(
    //     resolve => setTimeout(resolve, ms)
    //   );

    const parser = () => {
        //for each char in route.params.searchPath, call get TTS
        var chars = route.params.searchPath.split("");
        chars.forEach(element => {
            switch(element) {
                case 'N':
                    getTTS("Go North");
                    break;
                case 'E':
                    getTTS("Go East");
                    break;
                case 'S':
                    getTTS("Go South");
                    break;
                case 'W':
                    getTTS("Go West");
                    break;
                default:
                    getTTS("Go nowhere");
            }
            var d1 = new Date();
            var d2 = new Date();
            while(d2.getTime() - d1.getTime() < 1000) {
                d2 = new Date();
            }
            // await delay(1000);
        });
    }

    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Image source={route.params.imagePath} />
            <Text>Path: {route.params.searchPath}</Text>
            <Button
                onPress={parser}
                style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                <Text style={{color: "#FFFFFF"}}>TTS</Text>
            </Button>
        </View>

    );
  };

  export default PathDiagramScreen;