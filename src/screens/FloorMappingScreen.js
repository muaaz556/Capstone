import React, {useState, createContext} from 'react';
import {View} from 'native-base';
import CornerNodeState from '../components/organisms/CornerNodeState';
import DestinationNodeState from '../components/organisms/DestinationNodeState';
import HallwayNodeState from '../components/organisms/HallwayNodeState';
import FloorChangingNodeState from '../components/organisms/FloorChangingNodeState';
import BathroomNodeState from '../components/organisms/BathroomNodeState';
import NodeSelectionState from '../components/organisms/NodeSelectionState';
import { STATE_NAMES } from '../assets/locale/en';
import {NODES} from '../assets/colors/Colors.js';

export const CornerNodeStateContext = createContext();
export const DestinationNodeStateContext = createContext();
export const HallwayNodeStateContext = createContext();
export const BathroomNodeStateContext = createContext();
export const FloorChangingNodeStateContext = createContext();
export const NodeSelectionStateContext = createContext();

const FloorMappingScreen = ({route, navigation}) => {

  const [cornerNodeGestures, setCornerNodeGestures] = useState([]);
  const [destinationGestures, setDestinationGestures] = useState([]);
  const [hallwayGestures, setHallwayGestures] = useState([]);
  const [bathroomGestures, setBathroomGestures] = useState([]);
  const [floorChangingGestures, setFloorChangingGestures] = useState([]);
  const [connections, setConnections] = useState([]);

  const [windowH, setWindowH] = useState(0);
  const [stateName, setStateName] = useState(STATE_NAMES.CORNER_NODE_STATE);
  const [photo, setPhoto] = useState(null);

  const onLayout = (event) => {
    if (event.nativeEvent.layout.height < event.nativeEvent.layout.width) {
        setWindowH(event.nativeEvent.layout.height);
    }
  };

  const clearAllNodes = () => {
    setCornerNodeGestures([]);
    setDestinationGestures([]);
    setHallwayGestures([]);
    setBathroomGestures([]);
    setFloorChangingGestures([]);
  };

  return (
    <View style={ { flex: 1, flexDirection: 'row' } } onLayout={( (event) => { onLayout(event); } )}>
      {stateName === STATE_NAMES.CORNER_NODE_STATE ? (
        //initial state component
        <>
          <CornerNodeStateContext.Provider value={{
            state: [stateName, setStateName],
            photoState: [photo, setPhoto],
            cornerNodeGestures: [cornerNodeGestures, setCornerNodeGestures],
            }}>
            <CornerNodeState 
              buildingName={route.params.buildingName} 
              windowH={windowH} 
              clearAllNodes={clearAllNodes} 
              numOfCorners={route.params.numOfCorners} />
          </CornerNodeStateContext.Provider>
        </>
      ) : stateName === STATE_NAMES.DESTINATION_NODE_STATE ? (
        <>
          <DestinationNodeStateContext.Provider value={{
            state: [stateName, setStateName],
            destinationGestures: [destinationGestures, setDestinationGestures],
            }}>
            <DestinationNodeState windowH={windowH} photo={photo} />
          </DestinationNodeStateContext.Provider>
        </>
      ) : stateName === STATE_NAMES.HALLWAY_NODE_STATE ? (
        <>
          <HallwayNodeStateContext.Provider value={{
            state: [stateName, setStateName],
            hallwayGestures: [hallwayGestures, setHallwayGestures],
            }}>
            <HallwayNodeState windowH={windowH} photo={photo} />
          </HallwayNodeStateContext.Provider>
        </>
      ) : stateName === STATE_NAMES.FLOOR_CHANGING_NODE_STATE ? (
        <>
          <FloorChangingNodeStateContext.Provider value={{
            state: [stateName, setStateName],
            floorChangingGestures: [floorChangingGestures, setFloorChangingGestures],
            }}>
            <FloorChangingNodeState windowH={windowH} photo={photo} />
          </FloorChangingNodeStateContext.Provider>
        </>
      ) : stateName === STATE_NAMES.BATHROOM_NODE_STATE ? (
        <>
          <BathroomNodeStateContext.Provider value={{
            state: [stateName, setStateName],
            bathroomGestures: [bathroomGestures, setBathroomGestures],
            }}>
            <BathroomNodeState windowH={windowH} photo={photo} />
          </BathroomNodeStateContext.Provider>
        </>
      ) : stateName === STATE_NAMES.NODE_SELECTION_STATE ? (
        <>
          <NodeSelectionStateContext.Provider value={{
            state: [stateName, setStateName],
            connectionsArray: [connections, setConnections],
            }}>
            <NodeSelectionState
              windowH={windowH}
              photo={photo}
              navigation={navigation}
              buildingName={route.params.buildingName}
              floorName={route.params.floorName}
              allGestures={[{color: NODES.DESTINATION_NODE, array: destinationGestures, type: STATE_NAMES.DESTINATION_NODE_STATE},
                          {color: NODES.HALLWAY_NODE, array: hallwayGestures,  type: STATE_NAMES.HALLWAY_NODE_STATE},
                          {color: NODES.BATHROOM_NODE, array: bathroomGestures, type: STATE_NAMES.BATHROOM_NODE_STATE},
                          {color: NODES.FLOOR_CHANGING_NODE, array: floorChangingGestures, type: STATE_NAMES.FLOOR_CHANGING_NODE_STATE}]}
              />
          </NodeSelectionStateContext.Provider>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default FloorMappingScreen;
