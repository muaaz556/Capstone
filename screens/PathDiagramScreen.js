
import {Button} from 'native-base';
import { StyleSheet, Text, View, Image } from 'react-native';

const PathDiagramScreen = ({ navigation, route }) => {
    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Image source={require('../assets/favicon.png')} />
            <Text>Sample text: {route.params.searchPath}</Text>
            <Text>Sample text2: {route.params.test}</Text>
        </View>

    );
  };

  export default PathDiagramScreen;