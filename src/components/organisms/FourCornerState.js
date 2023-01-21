import React, {useState, createContext, useContext} from 'react';
import { StyleSheet } from 'react-native';
import { View} from 'native-base';
import { FourCornerStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from './NodePlacement';
import StateBar from './StateBar';
import { displayTextAlert } from '../../helper-functions/textAlert';
import { TOO_MANY_NODES_PLACED_TITLE, TOO_MANY_NODES_PLACED_ERROR_MESSAGE } from '../../assets/locale/en';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});

export const NodePlacementContext = createContext();
export const StateBarContext = createContext();

const FourCornerState = () => {


    //NodePlacement
        //image
        //place nodes ontop of it
        ////limit the number of placements to 4
    //StateBar
        //Add photo
        //Undo
        //Clear
        //Finish
            //take the 4 gesture locations and map them to the 4 GPS locations
                //format of data??
        
    

    const {windowHeight, state} = useContext(FourCornerStateContext);
    const [stateName, setStateName] = state;
    const [windowH, setWindowH] = windowHeight;

    const [photo, setPhoto] = useState(null);
    const [gestureLocations, setGestureLocations] = useState([]);

    if(gestureLocations.length > 4) {
        displayTextAlert(TOO_MANY_NODES_PLACED_TITLE, TOO_MANY_NODES_PLACED_ERROR_MESSAGE);
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    }

    return ( 
        <>
            <NodePlacementContext.Provider value={{ windowH: [windowH, setWindowH], gestures: [gestureLocations, setGestureLocations]}}>
                <NodePlacement photo={photo}/>
            </NodePlacementContext.Provider>

            <View style={styles.navBarView}>
                <StateBarContext.Provider value={{photo: [photo, setPhoto], gestures: [gestureLocations, setGestureLocations], state: [stateName, setStateName] }}>
                    <StateBar/>
                </StateBarContext.Provider>
            </View>
        </>
    )
}

export default FourCornerState;