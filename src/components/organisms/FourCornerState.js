import React, {useState, createContext, useContext, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { View} from 'native-base';
import { FourCornerStateContext } from '../../screens/FloorMappingScreen';
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

export const NodePlacementContext = createContext();
export const SideBarContext = createContext();
let getFourGPSCoords;


const FourCornerState = ({buildingName}) => {

    const {windowHeight, state} = useContext(FourCornerStateContext);
    const [stateName, setStateName] = state;
    const [windowH, setWindowH] = windowHeight;

    const [photo, setPhoto] = useState(null);
    const [gestureLocations, setGestureLocations] = useState([]);

    if (gestureLocations.length > 4) {
        displayTextAlert(TOO_MANY_NODES_PLACED_TITLE, TOO_MANY_NODES_PLACED_ERROR_MESSAGE);
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1));
    }

    const mapGesturesToGPS = async () => {
        getFourGPSCoords = await getGPSData('get-corner-cords', 'buildingName', buildingName);
        for (let i = 0; i < gestureLocations.length; i++) {
            getFourGPSCoords.cords.cornerCords[i]['gestureLat']  = gestureLocations[i].x;
            getFourGPSCoords.cords.cornerCords[i]['gestureLong'] = gestureLocations[i].y;
        }
        const requestData = JSON.stringify({'gpsCornerCord': [getFourGPSCoords]});
        postGPSData(requestData, 'post-corner-cords');
    };

    return ( 
        <>
            <NodePlacementContext.Provider value={{ windowH: [windowH, setWindowH], gestures: [gestureLocations, setGestureLocations]}}>
                <NodePlacement photo={photo}/>
            </NodePlacementContext.Provider>

            <View style={styles.navBarView}>
                <SideBarContext.Provider value={{photo: [photo, setPhoto], gestures: [gestureLocations, setGestureLocations], state: [stateName, setStateName] }}>
                    <SideBar mapGesturesToGPS={mapGesturesToGPS}/>
                </SideBarContext.Provider>
            </View>
        </>
    );
};

export default FourCornerState;
