import React, { useState } from 'react';

import { 
    View, 
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { Box, Button, Center, FormControl, Image, Input, Stack, Text, WarningOutlineIcon } from "native-base";
import Svg, { Circle } from 'react-native-svg';

import { getGPSData, postGPSData } from '../helper-functions/gpsFetching';

const styles = StyleSheet.create({
    view: {
        flex: 1, 
        alignItems: 'center', 
        marginTop: 100
    },
    text: {
        color: 'black'
    },
    loginButton: {
        marginTop: 10
    },
    logoContainer: {
        marginBottom: 25
    },
    logoImage: {
        marginBottom: 10
    }
  });

const LoginScreen = ({ navigation }) => {

    const postRequest = () => {
        const requestData = JSON.stringify({
            'gps': [
                {
                    'name': 'names',
                    'gpsCord': {
                        'x': 10,
                        'y': 10,
                    }
                }
            ]
        })

        postGPSData(requestData)
    }

    const handleGuestStudentButtonClick = () => {
        console.log('Fetching data')
        getGPSData()
    }

    const [gestureLocations, setGestureLocations] = useState([])

    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height

    const handleGestureClick = (evt) => {
        console.log("X : ", evt.nativeEvent.pageX)
        console.log("Y : ", evt.nativeEvent.pageY)

        let oldXRange = windowWidth
        let newXRange = 100
        let newXValue = ((evt.nativeEvent.pageX * newXRange) / oldXRange)

        let oldYRange = windowHeight
        let newYRange = 100
        let newYValue = ((evt.nativeEvent.pageY * newYRange) / oldYRange)

        let gestureItem = {
            x: newXValue, 
            y: newYValue
        }

        console.log(gestureLocations)
        console.log(windowWidth)
        console.log(windowHeight)

        setGestureLocations(gestureLocations => [...gestureLocations, gestureItem])
    }

    const listItems = gestureLocations.map((item, key) =>
        <>
            {/* <Text key={key} style={styles.text}>Item Value {item.x} and {item.y}</Text> */}
            {/* <Circle key={key} cx={100} cy={100} r="1" stroke="blue" fill="green" />
            <Circle key={key} cx={0} cy={100} r="1" stroke="green" fill="green" />
            <Circle key={key} cx={100} cy={0} r="1" stroke="purple" fill="green" />
            <Circle key={key} cx={0} cy={0} r="1" stroke="red" fill="green" /> */}
            <Circle key={key} cx={item.x} cy={item.y} r="1" stroke="blue" fill="green" />
        </>
    );

    return (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={(evt) => handleGestureClick(evt)}>

            <Image position='absolute' zIndex={10} width='100%' maxW='100%' marginTop='200px' alt='' source={require('../assets/images/parking-lot.png')} />

            <Svg zIndex={100} width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio='none'>
                {listItems}
            </Svg>

            {/* <View style={styles.view} >
                <Text style={styles.text}>Home Screen</Text>
                <Center style={styles.logoContainer}>
                    <Image style={styles.logoImage} source={require('../assets/images/splashscreen_logo.png')} size='xl' alt="Logo image"/>
                    <Text bold fontSize='md'>Eye Guide</Text>
                </Center>

                <Box w="100%" maxWidth="300px">
                    <FormControl isRequired>
                        <Stack mx="4">
                            <FormControl.Label>Username</FormControl.Label>
                            <Input type="text" defaultValue="" placeholder="Username"/>
                            <FormControl.Label>Password</FormControl.Label>
                            <Input type="password" defaultValue="12345" placeholder="password" />
                            <FormControl.HelperText>
                                Must be at least 6 characters.
                            </FormControl.HelperText>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                Atleast 6 characters are required.
                            </FormControl.ErrorMessage>
                            <Button style={styles.loginButton}>Login</Button>
                            <Button style={{marginTop: 10}} onPress={() => navigation.navigate('AdminHomeScreen')}>Guest Admin</Button>
                            <Button style={{marginTop: 10}} onPress={handleGuestStudentButtonClick}>Guest Student</Button>
                            <Button style={{marginTop: 10}} onPress={postRequest}>Post Request</Button>
                        </Stack>
                    </FormControl>
                </Box>
            </View> */}
        </TouchableOpacity>
    )
}

export default LoginScreen;