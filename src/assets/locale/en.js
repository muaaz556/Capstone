
export const OVERVIEW_PAGE_TITLE = 'Overview of \nMapping a Building';
export const OVERVIEW_INTRO_MESSAGE = 'To map a building you will complete the following steps:';
export const OVERVIEW_MESSAGE = '\n\u2022 Go to \
each corner of the building from the outside and then press the Get \
GPS Location button to get the current GPS location\n\u2022 Upload the \
building floorplan and then label the corners you visited in the first step \
on the floorplan\n\u2022 Label paths and locations in the building floorplan which \
will be used to navigate\n';

export const START_LABEL = 'Start';
export const NEXT_LABEL = 'Next';
export const GET_CURRENT_LOCATION_LABEL = 'Get Current Location';
export const SAVE_UPLOAD_FLOOR_PLAN_LABEL = 'Save and Upload Floorplan';
export const DISCARD_GPS_LOCATIONS_LABEL = 'Discard GPS Locations';

export const LOCATION_OF_CORNER_TITLE = 'Location of\nBuilding Corner';
export const BUILDING_NAME_TITLE = 'Which building would \n you like to map?';
export const FLOOR_NAME_TITLE = 'Which floor would \n you like to map?';
export const FLOOR_NAME_EXAMPLES = 'Ex. First, Basement, Block A Second, etc.';

export const FIRST_LOCATION_MESSAGE = 'Go to any distinct corner of the building and press the Get Current '
+ 'Location button.';
export const NEXT_LOCATION_MESSAGE = 'Go to the next distinct corner of the building and press the Get Current '
+ 'Location button.\n\nIf you have already obtained the current location for '
+ 'every distinct corner of the building, then press Save and Upload Floorplan ';

export const PLEASE_WAIT_MESSAGE = 'Please wait';

export const CLEAR = { TITLE: 'Clear Dots',
                        MESSAGE: 'This action will clear all of the dots on the screen.',
                    };

export const NANO_BLE = 'NanoBLE';

export const BLUETOOTH_PERMISSION = {
    TITLE: 'Location permission for bluetooth scanning',
    MESSAGE: 'Please provide permission in order to connect to the distance sensor',
    CANCEL: 'Cancel',
    ASK_LATER: 'Ask me later',
    OK: 'OK'
}

export const FINISH_TITLE = 'Finish Mapping';
export const FINISH_MESSAGE = 'Please ensure you have completed the following items:' +
                                '\n\u2022 Placed all corner locations on the map' +
                                '\n\u2022 Placed and labeled all room dots' +
                                '\n\u2022 Placed hallway dots' +
                                '\n\u2022 Placed stairway and elevator dots' +
                                '\n\u2022 Placed and labeled all bathroom dots' +
                                '\n\u2022 Connected all hallway dots to each other' +
                                '\n\u2022 Connected hallway dots to other relevant dots';

export const NEXT_TITLE = 'Go to Next Step';
export const NEXT_MESSAGE = 'Please ensure you have completed this step before proceeding.';

export const DIALOG = {DESTINATION_TITLE: 'Set Room Name/Number',
                        DESTINATION_DESCRIPTION: 'Please provide a name or number for the selected room.',
                        BATHROOM_TITLE: 'Set Bathroom Gender',
                        BATHROOM_DESCRIPTION: 'Please provide a gender for the selected bathroom.'

}

export const CORNERS_STATE = { TITLE: 'Specify Corners',
                                    MESSAGE: 'Please tap the corners of the building '
                                    + 'in the same order they were visited previously.',
                                    };

export const DESTINATION_NODE_STATE = { TITLE: 'Place Rooms',
                                    MESSAGE: 'Please place dots on the entrances to each room. '
                                    + 'If a room has multiple doors or entrances, please place dots on all of them. '
                                    + 'After placing a dot, press the label button to add a room name/number. '
                                    + 'You cannot place another dot until you label the previous one.',
                                    INVALID_TITLE: 'Missing Room Name/Number',
                                    INVALID_MESSAGE: 'Please enter room name before adding another dot.',
                                    };

export const HALLWAY_NODE_STATE = { TITLE: 'Add Hallways',
                                    MESSAGE: 'Please place dots throughout all hallways. '
                                    + 'Each dot should be at most 2m apart from one another. '
                                    + 'Place hallway dots on either side of every entrance to a room '
                                    + 'and on the corners and intersections of hallways. ',
                                    };

export const BATHROOM_NODE_STATE = { TITLE: 'Place Bathrooms',
                                    MESSAGE: 'Please place dots on each bathroom entrance. '
                                    + 'After placing a dot, press the label button to specify bathroom gender. '
                                    + 'You cannot place another dot until you label the previous one.',
                                    INVALID_TITLE: 'Missing Bathroom Gender Identification',
                                    INVALID_MESSAGE: 'Please specify bathroom gender before adding another dot.',
                                    };

export const FLOOR_CHANGING_NODE_STATE = { TITLE: 'Place Stairways and Elevators',
                                        MESSAGE: 'Please place dots on the entrances to any location '
                                        + 'that could be used to change floors',
                                        };

export const NODE_SELECTION_STATE = { HALLWAY_TITLE: 'Connect Hallways',
                                        HALLWAY_MESSAGE: 'Please create connections between hallway dots. '
                                        + 'To create a connection, tap a dot to select it. '
                                        + 'Then, tap the dot you would like to connect to. A connection will be drawn between the two. ' 
                                        + 'Connections are used to show the path a user can walk.',

                                        DESTINATION_TITLE: 'Attach Rooms to Hallways',
                                        DESTINATION_MESSAGE: 'Please connect the hallways to the rooms, bathrooms, etc. '
                                        + 'Each of the room dots must be connected to the two closest hallways dots. '
                                        + 'The user must be able to walk from the hallway dot to the entrance of the room '
                                        + 'for the connection to be valid.',
                                        };

export const TOO_MANY_NODES_PLACED = { TITLE: 'Too Many Corners Detected',
                                        MESSAGE: 'You have already placed the total number of corners. Please press undo if '
                                        + 'you need to replace any poorly placed dots.',
                                        };

export const ENTER_NODE_NAME_TITLE = 'Enter the room name';

export const BUTTON = { NEXT: 'Next',
                        UNDO: 'Undo',
                        CLEAR: 'Clear',
                        UPLOAD: 'Upload',
                        BACK: 'Back',
                        LABEL: 'Label',
                        UNSELECT: 'Unselect',
                        VIEW_TEXT: 'View Text',
                        HELP: 'Help',
                        };

export const DESCRIPTION = 'Description';

export const STATE_NAMES = { CORNER_NODE_STATE: 'CornerNodeState',
                            DESTINATION_NODE_STATE: 'DestinationNodeState',
                            HALLWAY_NODE_STATE: 'HallwayNodeState',
                            BATHROOM_NODE_STATE: 'BathroomNodeState',
                            FLOOR_CHANGING_NODE_STATE : 'FloorChangingNodeState',
                            NODE_SELECTION_STATE : 'NodeSelectionState',
                            };

export const DISTANCE_LIMIT = 200
export const ENABLE_DISTANCE_SENSOR_VIBRATION = true
export const VIBRATION_DURATION = 100
export const SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214'
export const CHARACTERISTIC_UUID = '1A3AC131-31EF-758B-BC51-54A61958EF82'