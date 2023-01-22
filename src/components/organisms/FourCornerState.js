import React, {useState, createContext, useContext, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { View} from 'native-base';
import { FourCornerStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from './NodePlacement';
import SideBar from './SideBar';
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


    //NodePlacement
        //image
        //place nodes ontop of it
        ////limit the number of placements to 4
    //SideBar
        //Add photo
        //Undo
        //Clear
        //Finish
            //take the 4 gesture locations and map them to the 4 GPS locations
                //format of data??

    
    useEffect(() => {
        //Runs only on the first render
        // getFourGPSCoords = getGPSData('get-corner-cords', 'buildingName', buildingName);
        // console.log(buildingName);
        //res is json
    }, [buildingName]);

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
        //find corresponding GPS for each set of gestures in gestureLocations
        console.log("state name has updated and we can do gesture location stuff here");
        // getFourGPSCoords = await getGPSData('get-corner-cords', 'buildingName', buildingName).then(response => response.json())
        // .then(response => {
        
        //     console.log("asjdolasdask??", response)
        
        // });
        // {"buildingName": "RCH", "cords": {"cornerCords": [[Object], [Object]]}}
        getFourGPSCoords = await getGPSData('get-corner-cords', 'buildingName', buildingName);
        console.log("FINAL  ", getFourGPSCoords);
        console.log("coords ", getFourGPSCoords.cords.cornerCords[0].gestureLat);
        console.log("gestures x ", gestureLocations[0].x);
        // coords  {"gestureLat": null, "gestureLong": null, "lat": 43.47747747747748, "long": -80.5248301073921} 
        for (let i = 0; i < gestureLocations.length; i++) {
            //add gestureLocations[i].x & gestureLocations[i].y to getFourGPSCoords[i].gesture-lat & getFourGPSCoords[i].gesture-long
            // console.log("coords ", getFourGPSCoords.cords);
            getFourGPSCoords.cords.cornerCords[i]['gestureLat']  = gestureLocations[i].x;
            getFourGPSCoords.cords.cornerCords[i]['gestureLong'] = gestureLocations[i].y;
        }
        const requestData = JSON.stringify({'gpsCornerCord': [getFourGPSCoords]});
        console.log("request Data: ", requestData);
        postGPSData(requestData, 'post-corner-cords');
        // {"cornerCords": [{"lat": 43.47747747747748, "long": -80.5248301073921, "gesture-lat": null, "gesture-long": null}, {"lat": 43.47747747747748, "long": -80.5248301073921, "gesture-lat": null, "gesture-long": null}]}
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
