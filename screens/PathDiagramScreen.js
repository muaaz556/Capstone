
import {Button} from 'native-base';
import { StyleSheet, Text, View, Image } from 'react-native';

const PathDiagramScreen = ({ navigation, route }) => {
    return (
        <View style = {{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Image source={route.params.imagePath} />
            <Text>Path: {route.params.searchPath}</Text>
        </View>

    );
  };

  export default PathDiagramScreen;