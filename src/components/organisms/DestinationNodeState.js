import React, {useState, createContext, useContext, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { View} from 'native-base';
import { DestionationNodeStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert } from '../../helper-functions/textAlert';
import { TOO_MANY_NODES_PLACED_TITLE, TOO_MANY_NODES_PLACED_ERROR_MESSAGE } from '../../assets/locale/en';
import { getGPSData, postGPSData } from '../../helper-functions/gpsFetching';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});

const NodePlacementContext2 = createContext();
const SideBarContext2 = createContext();


const DestinationNodeState = () => {

    const {windowHeight, state, photoState} = useContext(DestionationNodeStateContext);
    const [stateName, setStateName] = state;
    const [windowH, setWindowH] = windowHeight;
    const [photo, setPhoto] = photoState;

    const [gestureLocations, setGestureLocations] = useState([]);

    return ( 
        <>
            <NodePlacementContext2.Provider value={{ windowH: [windowH, setWindowH], gestures: [gestureLocations, setGestureLocations]}}>
                <NodePlacement photo={photo} NodePlacementContext={NodePlacementContext2}/>
            </NodePlacementContext2.Provider>

            <View style={styles.navBarView}>
                <SideBarContext2.Provider value={{photo: [photo, setPhoto], gestures: [gestureLocations, setGestureLocations], state: [stateName, setStateName] }}>
                    <SideBar SideBarContext={SideBarContext2}/>
                </SideBarContext2.Provider>
            </View>
        </>
    );
};

export default DestinationNodeState;
