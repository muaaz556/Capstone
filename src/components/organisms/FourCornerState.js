import React, {useState, createContext, useContext, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { FourCornerStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert } from '../../helper-functions/textAlert';
import { TOO_MANY_NODES_PLACED_TITLE, TOO_MANY_NODES_PLACED_ERROR_MESSAGE, FOUR_CORNERS_STATE_TITLE, FOUR_CORNERS_STATE_MESSAGE } from '../../assets/locale/en';
import { getGPSData, postGPSData } from '../../helper-functions/gpsFetching';
import { launchImageLibrary } from 'react-native-image-picker';


const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});

const NodePlacementContext = createContext();
const SideBarContext = createContext();
let getFourGPSCoords;


const FourCornerState = ({buildingName}) => {

    const {windowHeight, state, photoState} = useContext(FourCornerStateContext);
    const [stateName, setStateName] = state;
    const [windowH, setWindowH] = windowHeight;

    const [photo, setPhoto] = photoState;
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

    const func1 = () => {
        const options = {
            noData: true,
        };
    
        launchImageLibrary(options, response => {
            if (response.assets && response.assets[0].uri) {
            setPhoto(response.assets[0]);
            setGestureLocations([]);
            displayTextAlert(FOUR_CORNERS_STATE_TITLE, FOUR_CORNERS_STATE_MESSAGE);
            }
        });
        console.log("func1");
    }

    const func2 = () => {
        console.log("func2");
        if(stateName === "state1"){
            mapGesturesToGPS();
        }

        const stateIndex = stateNames.indexOf(stateName);
        if(stateIndex == stateNames.length - 1) {
            console.log("you're on the last state already.");
        } else {
            setStateName(stateNames[(stateIndex + 1)]);
        }
    }

    const func3 = () => {
        setGestureLocations([]);
        console.log("func3");
    }

    const func4 = () => {
        setGestureLocations((point) => point.filter((_, index) => index !== gestureLocations.length - 1))
        console.log("func4");
    }

    return ( 
        <>
            <NodePlacementContext.Provider value={{ windowH: [windowH, setWindowH], gestures: [gestureLocations, setGestureLocations]}}>
                <NodePlacement photo={photo} NodePlacementContext={NodePlacementContext}/>
            </NodePlacementContext.Provider>

            <View style={styles.navBarView}>
                <SideBarContext.Provider value={{photo: [photo, setPhoto], gestures: [gestureLocations, setGestureLocations], state: [stateName, setStateName] }}>
                    <SideBar mapGesturesToGPS={mapGesturesToGPS} SideBarContext={SideBarContext} onPressFunctions={[func1, func2, func3, func4]}/>
                </SideBarContext.Provider>
            </View>
        </>
    );
};

export default FourCornerState;
