import {Button, Hidden} from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Button 
            onPress={() =>
                navigation.navigate('Distance')
            }
            style={{width:250,height: 100, backgroundColor:'#99004d',marginTop:20, borderRadius:20}}>
                    <Text style={{color: "#FFFFFF", fontSize:20, fontWeight:'bold'}}>Object Sensing Screen</Text>
            </Button>
        </View>
    );
  };

  export default HomeScreen;