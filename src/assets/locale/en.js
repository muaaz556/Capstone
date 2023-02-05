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

export const NEXT_TITLE = 'Go to Next Step';
export const NEXT_MESSAGE = 'Please ensure you have completed this step before proceeding.';

// TODO: PLS CONNOR REWRITE THE MESSAGES
// look for synonyms to the word "add" in this context
// need a better way to explain that we want hallway nodes placed on either side of a room
export const CORNERS_STATE = { TITLE: 'Add Corners',
                                    MESSAGE: 'Please click on the corners of the building '
                                    + 'in the same order that you visited them previously.',
                                    };

export const DESTINATION_NODE_STATE = { TITLE: 'Add Rooms',
                                    MESSAGE: 'Please place dots on the entrances of all the rooms. '
                                    + 'If a room has multiple doors, please place dots on all of them. '
                                    + 'After placing a dot, press the label button to add a room name. '
                                    + 'You cannot place another dot until you label the previous one.',
                                    };

export const HALLWAY_NODE_STATE = { TITLE: 'Add Hallways',
                                    MESSAGE: 'Please place dots on the hallways. '
                                    + 'These dots should be placed on all hallways that lead to rooms '
                                    + 'and be approximately 2m apart from one another. '
                                    + 'Hallway dots should be placed on either side of every entrance to a room.',
                                    };

export const BATHROOM_NODE_STATE = { TITLE: 'Add Bathrooms',
                                    MESSAGE: 'Please place dots on the bathroom entrances. '
                                    + 'After placing a dot, press the label button to specify bathroom type. '
                                    + 'You cannot place another dot until you label the previous one.',
                                    };

export const FLOOR_CHANGING_NODE_STATE = { TITLE: 'Add Stairways and Elevators',
                                        MESSAGE: 'Please place dots on the entrances to any location '
                                        + 'that could be used to change floors ex: stairs, elevators, etc.',
                                        };

export const NODE_SELECTION_STATE = { HALLWAY_TITLE: 'Connect Hallways',
                                        HALLWAY_MESSAGE: 'Please create connections between hallway dots. '
                                        + 'To create a connection, first click on a dot to select it. '
                                        + 'Then click on another dot to create a connection between the two. '
                                        + 'Connections are used to show the path a user can walk.',

                                        DESTINATION_TITLE: 'Connect Hallways to Rooms',
                                        DESTINATION_MESSAGE: 'Please connect the hallways to the rooms, bathrooms, etc. '
                                        + 'Each of the room dots must be connected to the two closest hallways dots. '
                                        + 'The user must be able to walk from the hallway dot to the entrance of the room '
                                        + 'for the connection to be valid.',
                                        };

export const TOO_MANY_NODES_PLACED = { TITLE: 'Too Many Corners Detected',
                                        MESSAGE: 'You have already placed the total number of corners. Please undo if '
                                        + 'you need to replace any poorly placed dots.',
                                        };

export const ENTER_NODE_NAME_TITLE = 'Enter the room name';

export const BUTTON = { NEXT: 'Next',
                        UNDO: 'Undo',
                        CLEAR: 'Clear',
                        UPLOAD: 'Upload',
                        BACK: 'Back',
                        UNSELECT: 'Unselect',
                        VIEW_TEXT: 'View Text',
                        };

export const DESCRIPTION = 'Description';

export const STATE_NAMES = { CORNER_NODE_STATE: 'CornerNodeState',
                            DESTINATION_NODE_STATE: 'DestinationNodeState',
                            HALLWAY_NODE_STATE: 'HallwayNodeState',
                            BATHROOM_NODE_STATE: 'BathroomNodeState',
                            FLOOR_CHANGING_NODE_STATE : 'FloorChangingNodeState',
                            NODE_SELECTION_STATE : 'NodeSelectionState',
                            };
