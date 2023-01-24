export const OVERVIEW_PAGE_TITLE = "Overview of \nMapping a Building"
export const OVERVIEW_INTRO_MESSAGE = "To map a building you will complete the following steps:"
export const OVERVIEW_MESSAGE = "\n\u2022 Go to \
each corner of the building from the outside and then press the Get \
GPS Location button to get the current GPS location\n\u2022 Upload the \
building map and then label the corners you visited in the first step \
on the map\n\u2022 Label paths and locations in the building map which \
will be used to navigate\n"

export const START_LABEL = "Start"
export const NEXT_LABEL = "Next"
export const GET_CURRENT_LOCATION_LABEL = "Get Current Location"
export const SAVE_UPLOAD_MAP_LABEL = "Save and Upload Floor Map"
export const DISCARD_GPS_LOCATIONS_LABEL = "Discard GPS Locations"

export const LOCATION_OF_CORNER_TITLE = "Location of\nBuilding Corner"
export const BUILDING_NAME_TITLE = "Enter the Name\nof the Building"

export const FIRST_LOCATION_MESSAGE = "Go to any distinct corner of the building and press the Get Current \
Location button."
export const NEXT_LOCATION_MESSAGE = "Go to the next distinct corner of the building and press the Get Current \
Location button.\n\nIf you have already obtained the current location for \
every distinct corner of the building, then press Save and Upload Floor Map "

export const PLEASE_WAIT_MESSAGE = "Please wait"

export const CLEAR_TITLE = "Clear GPS Coordinates"
export const CLEAR_MESSAGE = "This action will clear all of the coordinates on the screen."
export const CLEAR = { TITLE: 'Clear GPS Coordinates', 
                                    MESSAGE: 'This action will clear all of the coordinates on the screen.', 
                                    };

export const NEXT_TITLE = "Go to Next State"
export const NEXT_MESSAGE = "Please ensure you have completed this state before proceeding."
export const NEXT = { TITLE: 'Go to Next State', 
                                    MESSAGE: 'Please ensure you have completed this state before proceeding.', 
                                    };

export const FOUR_CORNERS_STATE_TITLE = "Add Corner GPS Coordinates"
export const FOUR_CORNERS_STATE_MESSAGE = "Please click on the four corners of the building in the uploaded \
floorplan in the same order that you visited them previously."
export const FOUR_CORNERS_STATE = { TITLE: 'Add Corner GPS Coordinates', 
                                    MESSAGE: 'Please click on the four corners of the building in the uploaded \
                                    floorplan in the same order that you visited them previously.', 
                                    };

export const DESTINATION_NODE_STATE_TITLE = "Add Destination GPS Coordinates"
export const DESTINATION_NODE_STATE_MESSAGE = "Please click on the map of the building to place nodes \
that are destinations such as rooms."
export const DESTINATION_NODE_STATE = { TITLE: 'Add Destination GPS Coordinates', 
                                    MESSAGE: 'Please click on the map of the building to place nodes \
                                    that are destinations such as rooms.', 
                                    };

export const HALLWAY_NODE_STATE_TITLE = "Add Hallway GPS Coordinates"
export const HALLWAY_NODE_STATE_MESSAGE = "Please click on the map of the building to place nodes \
that are hallways."
export const HALLWAY_NODE_STATE = { TITLE: 'Add Hallway GPS Coordinates', 
                                    MESSAGE: 'Please click on the map of the building to place nodes \
                                    that are hallways.', 
                                    };

export const BATHROOM_NODE_STATE_TITLE = "Add Bathroom GPS Coordinates"
export const BATHROOM_NODE_STATE_MESSAGE = "Please click on the map of the building to place nodes \
that are bathrooms."
export const BATHROOM_NODE_STATE = { TITLE: 'Add Bathroom GPS Coordinates', 
                                    MESSAGE: 'Please click on the map of the building to place nodes \
                                    that are bathrooms.', 
                                    };

export const FLOOR_CHANGING_NODE_STATE_TITLE = "Add Floor Changing GPS Coordinates"
export const FLOOR_CHANGING_NODE_STATE_MESSAGE = "Please click on the map of the building to place nodes \
that could be used to change floors ex: stairs, elevators, etc."
export const FLOOR_CHANGING_NODE_STATE = { TITLE: 'Add Floor Changing GPS Coordinates', 
                                        MESSAGE: 'Please click on the map of the building to place nodes \
                                        that could be used to change floors ex: stairs, elevators, etc.', 
                                        };

export const NODE_SELECTION_NODE_STATE_TITLE = "Select Nodes Placed on Map"
export const NODE_SELECTION_NODE_STATE_MESSAGE = "Please click on the map of the building to select any nodes."
export const NODE_SELECTION_NODE_STATE = { TITLE: 'Select Nodes Placed on Map', 
                                        MESSAGE: 'Please click on the map of the building to select any nodes.', 
                                        };

export const TOO_MANY_NODES_PLACED_TITLE = "Multiple Corner Nodes Detected"
export const TOO_MANY_NODES_PLACED_ERROR_MESSAGE = "You have already placed 4 corner nodes. Please undo if \
you need to replace any poorly placed nodes."
export const TOO_MANY_NODES_PLACED = { TITLE: 'Multiple Corner Nodes Detected', 
                                        MESSAGE: 'You have already placed 4 corner nodes. Please undo if \
                                        you need to replace any poorly placed nodes.', 
                                        };

export const BUTTON_NEXT = "Next";
export const BUTTON_UNDO = "Undo";
export const BUTTON_CLEAR = "Clear";
export const BUTTON_UPLOAD = "Upload";
export const BUTTON_BACK = "Back";
export const BUTTON = { NEXT: 'Next', 
                        UNDO: 'Undo', 
                        CLEAR: 'Clear', 
                        UPLOAD: 'Upload', 
                        BACK: 'Back', 
                        };

export const DESCRIPTION = "Description";

export const STATE_NAMES = { FOUR_CORNER_STATE: 'FourCornerState', 
                            DESTINATION_NODE_STATE: 'DestinationNodeState', 
                            HALLWAY_NODE_STATE: 'HallwayNodeState',
                            BATHROOM_NODE_STATE: 'BathroomNodeState',
                            FLOOR_CHANGING_NODE_STATE : 'FloorChangingNodeState',
                            NODE_SELECTION_STATE : 'NodeSelectionState',
                            };