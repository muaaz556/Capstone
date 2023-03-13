import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { NodeSelectionStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import PleaseWait from '../molecules/PleaseWait';
import { displayTextAlert, displayTwoButtonTextAlert } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, NODE_SELECTION_STATE, FINISH_MESSAGE, STATE_NAMES, FINISH_TITLE } from '../../assets/locale/en';
import {NODES} from '../../assets/colors/Colors.js';
import {Ellipse, Line} from 'react-native-svg';
import { postGPSData, getGPSData } from '../../helper-functions/gpsFetching';
import uuid from 'react-native-uuid';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.16,
      },
});

const NodeSelectionState = ({windowH, photo, allGestures, navigation, buildingName, floorName}) => {

    const {state, connectionsArray} = useContext(NodeSelectionStateContext);
    const [stateName, setStateName] = state;
    const [connections, setConnections] = connectionsArray;
    const [selectedNode, setSelectedNode] = useState(null);
    const [showPleaseWait, setShowPleaseWait] = useState(false);
    const [makingHallwayConnections, setMakingHallwayConnections] = useState(true);

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.UNSELECT, BUTTON.NEXT, BUTTON.BACK, BUTTON.HELP];

    useEffect(() => {
        displayTextAlert(NODE_SELECTION_STATE.HALLWAY_TITLE, NODE_SELECTION_STATE.HALLWAY_MESSAGE);
    }, []);

    const nodeCurrentlySelected = (item) => {
        return item.x === selectedNode?.x && item.y === selectedNode?.y;
    };

    const listItemGen = () => {
        let size = 0;
        let listItems = [];
        let listItem = connections.map((item, key) => (
            <View key={uuid.v4()}>
                <Line
                    x1={item[0].x}
                    y1={item[0].y}
                    x2={item[1].x}
                    y2={item[1].y}
                    stroke={isHallwayType(item[0]) && isHallwayType(item[1])? NODES.CONNECTING_HALLWAYS : NODES.CONNECTING_NODE}
                    strokeWidth="0.75"
                />
            </View>
        ));
        listItems = listItems.concat(listItem);
        allGestures.forEach(gestureList => {
            let listItem = gestureList.array.map((item, key) => (
                <View key={uuid.v4()}>
                    <Ellipse
                        cx={item.x}
                        cy={item.y}
                        rx="0.7"
                        ry="1.3"
                        strokeWidth="0.3"
                        stroke={nodeCurrentlySelected(item) ? NODES.SELECTED_NODE : gestureList.color}
                        fill={gestureList.color}
                    />
                </View>
            ));
            listItems = listItems.concat(listItem);
            size += listItems.length;
        });
        return listItems;
    }

    const isHallwayType = (testItem) => {
        let flag = false;
        allGestures.forEach(gestureList => {
            if (gestureList.array.includes(testItem) && gestureList.type === STATE_NAMES.HALLWAY_NODE_STATE){
                flag = true;
            }
        });
        return flag;
    }

    const next = () => {
        if (makingHallwayConnections) {
            displayTextAlert(NODE_SELECTION_STATE.DESTINATION_TITLE, NODE_SELECTION_STATE.DESTINATION_MESSAGE);
            setMakingHallwayConnections(false);
            return;
        }
        displayTwoButtonTextAlert(FINISH_TITLE, FINISH_MESSAGE, 
            () => {
                console.log('next function');

                setShowPleaseWait(true);
                let gestureArray = [];

                allGestures.forEach(gestureList => {
                    gestureList.array.map((item, key) => (
                        gestureArray.push(
                            {
                                guid: item.guid,
                                type: gestureList.type,
                                x: item.x,
                                y: item.y,
                                adjacencyList: item.adjacencyList,
                                name: item.name,
                            }
                        )
                    ));
                })
                const requestData = JSON.stringify({
                    node:
                    {
                        buildingName: buildingName,
                        floorName: floorName,
                        nodes: gestureArray
                    },
                });
                postGPSData(requestData, 'post-nodes').then(() =>
                    {
                        setShowPleaseWait(false);
                        navigation.navigate('AccessibilityScreen');
                    }
                );
            }
        );
    }

    const back = () => {
        console.log("back function");
        setStateName(STATE_NAMES.BATHROOM_NODE_STATE);
    }

    const clear = () => {
        displayTwoButtonTextAlert(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                allGestures.forEach(gestureList => {
                    gestureList.array.map((item, key) => (
                        item.adjacencyList = []
                    ));
                });
                setConnections([]);
            }
        );
    }

    const undo = () => {
        setConnections((connection) => connection.filter((_, index) => index !== connections.length - 1));
    }

    const unselect = () => {
        // unselect a node (clear the variable)
        setSelectedNode(null);
    }

    const viewText = () => {
        // create a text alert for showing text for node selected
        displayTextAlert("Title", "Node name: " + selectedNode.name);
    }

    const distance = (gesture1, gesture2) => {
        return Math.sqrt(Math.pow(gesture1.x - gesture2.x,2) + Math.pow(gesture1.y - gesture2.y,2))
    }

    const createConnection = (node1, node2) => {
        node1.adjacencyList.push(node2.guid);
        node2.adjacencyList.push(node1.guid);
        setConnections(connections => [...connections, [node1, node2]]);
    }

    const doesConnectionExist = (node1, node2) => {
        console.log("checking connections");
        connections.forEach(connection => {
            if ( (JSON.stringify(connection[0].guid) === JSON.stringify(node1.guid)) && (JSON.stringify(connection[1].guid) === JSON.stringify(node2.guid)) 
             ||  (JSON.stringify(connection[0].guid) === JSON.stringify(node2.guid)) && (JSON.stringify(connection[1].guid) === JSON.stringify(node1.guid)) ){
                return true;
            }
        });
        return false;
    }

    const updateGesture = (gestureItem) => {

        //find which node was closest to the current click
        let minDistance = 10000000;
        let connectingNode = null;
        allGestures.forEach(gestureList => {
            gestureList.array.forEach( gesture => {
                let dist = distance(gestureItem, gesture);
                if(dist < minDistance) {
                    minDistance = dist;
                    connectingNode = gesture;
                }
            })
        })

        if(minDistance > 10) {
            console.log("too far from any nodes, likely a misclick?");
            return;
        }
        if(selectedNode === null) {
            //select a node
            setSelectedNode(connectingNode);
        } 
        else {
            //make a connection
            if(doesConnectionExist(selectedNode, connectingNode)) {
                // add alert
                return; 
            }
            if(selectedNode === connectingNode) {
                // add alert
                console.log("Node cannot connect to itself bud.")
                return; 
            }
            createConnection(selectedNode, connectingNode);
            setSelectedNode(connectingNode);
        }

    }

    const help = () => {
        if (makingHallwayConnections) {
            displayTextAlert(NODE_SELECTION_STATE.HALLWAY_TITLE, NODE_SELECTION_STATE.HALLWAY_MESSAGE);
        } else {
            displayTextAlert(NODE_SELECTION_STATE.DESTINATION_TITLE, NODE_SELECTION_STATE.DESTINATION_MESSAGE);
        }
    }

    const onPress = (buttonName) => {
        switch (buttonName) {
            case BUTTON.NEXT:
                next();
                break;
            case BUTTON.CLEAR:
                clear();
                break;
            case BUTTON.UNDO:
                undo();
                break;
            case BUTTON.BACK:
                back();
                break;
            case BUTTON.VIEW_TEXT:
                viewText();
                break;
            case BUTTON.UNSELECT:
                unselect();
                break;
            case BUTTON.HELP:
                help();
                break;
            default:
                console.log("invalid button name");

        }
    }

    const isDisabled = (buttonName) => {
        return ((buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && connections.length === 0 )
                || (buttonName === BUTTON.UNSELECT && selectedNode === null) || (buttonName === BUTTON.VIEW_TEXT && (selectedNode?.name === '' || selectedNode === null));
    }

    return ( 
        <>
            {showPleaseWait ? (<><PleaseWait/></>):
            (<>
                <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItemGen()}/>
                <View style={styles.navBarView}>
                    <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
                </View>
            </>
            )}
        </>
    );
};

export default NodeSelectionState;
