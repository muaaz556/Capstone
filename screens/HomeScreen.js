import {Button} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Button 
            onPress={() =>
                navigation.navigate('Distance')
            }
            style={{width:170,backgroundColor:'#99004d',marginTop:20,}}>
                    <Text>Object Sensing Screen</Text>
            </Button>
        </View>
    );
  };

  export default HomeScreen;