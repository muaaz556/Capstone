import React from 'react';

import { 
    View, 
    StyleSheet
} from 'react-native';

import { Box, Button, Center, FormControl, Image, Input, Stack, Text, WarningOutlineIcon } from "native-base";
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

    return (
        <View style={styles.view} >
            {/* <Text style={styles.text}>Home Screen</Text> */}
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
                            Must be atleast 6 characters.
                        </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Atleast 6 characters are required.
                        </FormControl.ErrorMessage>
                        <Button style={styles.loginButton}>Login</Button>
                        <Button style={{marginTop: 10}} onPress={() => navigation.navigate('AccessibilityScreen')}>Accessibility</Button>
                        <Button style={{marginTop: 10}} onPress={() => navigation.navigate('AdminHomeScreen')}>Guest Admin</Button>
                        <Button style={{marginTop: 10}} onPress={handleGuestStudentButtonClick}>Guest Student</Button>
                        <Button style={{marginTop: 10}} onPress={postRequest}>Post Request</Button>
                    </Stack>
                </FormControl>
            </Box>

        </View>
    )
}

export default LoginScreen;