import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';
import { NodeSelectionStateContext } from '../../screens/FloorMappingScreen';
import NodePlacement from '../molecules/NodePlacement';
import SideBar from '../molecules/SideBar';
import { displayTextAlert, displayTextAlertClear, displayTextAlertNext } from '../../helper-functions/textAlert';
import { BUTTON, CLEAR, NODE_SELECTION_STATE, NEXT_TITLE, NEXT_MESSAGE, STATE_NAMES } from '../../assets/locale/en';
import {Ellipse, Line} from 'react-native-svg';

const styles = StyleSheet.create({ 
    navBarView: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: 'black',
        borderLeftWidth: 5,
      },
});


const NodeSelectionState = ({windowH, photo, allGestures}) => {

    const {state, connectionsArray} = useContext(NodeSelectionStateContext);
    const [stateName, setStateName] = state;
    const [connections, setConnections] = connectionsArray;
    const [selectedNode, setSelectedNode] = useState(null);

    const listOfButtonNames = [BUTTON.UNDO, BUTTON.CLEAR, BUTTON.UNSELECT, BUTTON.VIEW_TEXT, BUTTON.NEXT, BUTTON.BACK];

    useEffect(() => {
        displayTextAlert(NODE_SELECTION_STATE.TITLE, NODE_SELECTION_STATE.MESSAGE); 
    }, []);

    const nodeCurrentlySelected = (item) => {
        return item.x === selectedNode?.x && item.y === selectedNode?.y;
    }
    
    const listItemGen = () => {

        //MAKE MORE EFFICIENT, CURRENTLY THE LIST OF ITEMS IS REGENERATED UPON EACH RE-RENDER
        //returns listItems if we have already generated the list of nodes to be displayed
        // if(listItems.length !== 0) {
        //     console.log("listItems already has stuff in it, being reused");
        //     return listItems;
        // }
        // console.log("generating listItems from scratch");

        let size = 0;
        let listItems = [];
        let listItem = connections.map((item, key) => (
            <View key={key+size}>
                <Line
                    x1={item[0].x}
                    y1={item[0].y}
                    x2={item[1].x}
                    y2={item[1].y}
                    stroke="black"
                    strokeWidth="0.5"
                />
            </View>
        ));
        listItems = listItems.concat(listItem);
        allGestures.forEach(gestureList => {
            let listItem = gestureList.array.map((item, key) => (
                <View key={key+size}>
                    <Ellipse
                        cx={item.x}
                        cy={item.y}
                        rx="0.7"
                        ry="1.3"
                        strokeWidth="0.2"
                        stroke={nodeCurrentlySelected(item) ? "black" : gestureList.color}
                        fill={gestureList.color}
                    />
                </View>
            ));
            listItems = listItems.concat(listItem);
            size += listItems.length;
        });
        return listItems;
    }

    const next = () => {
        console.log("next function");
        displayTextAlertNext(NEXT_TITLE, NEXT_MESSAGE, 
            () => {
                //STUFF to do before moving to next state
                setStateName(STATE_NAMES.NODE_SELECTION_STATE);
            }
        );
    }

    const back = () => {
        console.log("back function");
        setStateName(STATE_NAMES.BATHROOM_NODE_STATE);
    }

    const clear = () => {
        console.log("clear function invoked");
        displayTextAlertClear(CLEAR.TITLE, CLEAR.MESSAGE, 
            () => {
                setConnections([]);
                console.log("clear function called");
            }
        );
    }

    const undo = () => {
        console.log("undo function");
        setConnections((connection) => connection.filter((_, index) => index !== connections.length - 1));
    }

    const unselect = () => {
        // unselect a node (clear the variable)
        console.log("unselect function");
        setSelectedNode(null);
    }

    const viewText = () => {
        // create a text alert for showing text for node selected
        console.log("view text function");
    }

    const distance = (gesture1, gesture2) => {
        return Math.sqrt(Math.pow(gesture1.x - gesture2.x,2) + Math.pow(gesture1.y - gesture2.y,2))
    }

    const createConnection = (node1, node2) => {
        setConnections(connections => [...connections, [node1, node2]]);
    }

    const doesConnectionExist = (node1, node2) => {
        connections.forEach(connection => {
            if (connection === [node1, node2] || connection === [node2, node1]) {
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
                console.log("Duplicate connection")
                return; 
            }
            if(selectedNode === connectingNode) {
                // add alert
                console.log("Node cannot connect to itself bud.")
                return; 
            }
            createConnection(selectedNode, connectingNode);
            setSelectedNode(null);
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
            default:
                console.log("invalid button name");

        }
    }
    
    const isDisabled = (buttonName) => {
        return ((buttonName === BUTTON.UNDO || buttonName === BUTTON.CLEAR) && connections.length === 0 )
                || (buttonName === BUTTON.UNSELECT && selectedNode === null);
    }

    return ( 
        <>
            <NodePlacement photo={photo} windowH={windowH} updateGesture={updateGesture} listItems={listItemGen()}/>

            <View style={styles.navBarView}>
                <SideBar onPress={onPress} stateName={stateName} isDisabled={isDisabled} listOfButtonNames={listOfButtonNames}/>
            </View>
        </>
    );
};

export default NodeSelectionState;
