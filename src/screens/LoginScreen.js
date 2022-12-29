import React, { useEffect, useState } from 'react';

import { 
    View, 
    StyleSheet
} from 'react-native';

import { Box, Button, Center, FormControl, Image, Input, Stack, Text, WarningOutlineIcon } from "native-base";
import axios from 'axios';

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

    const handleGuestAdminButtonClick = () => {

    }

    // const handleGuestStudentButtonClick = () => {
    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({'x': 1, 'y': 2}),
    //     };

    //     fetch("http://127.0.0.1:8000/api/insert/", requestOptions);
    // }

    const [allUser, setAllUsers] = useState([]);

    // const handleGuestStudentButtonClick = async () => {
    //     try{
    //         console.log("Here")
    //         const users = await fetch('http://192.168.0.244:8000/api/gps/').then(response => response.json());
    //         console.log('Users', users)
    //     }
    //     catch (error){ console.log(error)}
    // }

    const postRequest = () => {
        fetch('https://a487-38-13-189-73.ngrok.io/api/post-gps', {
            method: 'POST',
            headers: {
                "access-control-allow-origin" : "*",
                'Accept': 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify({
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
        })
    }

    const handleGuestStudentButtonClick = () => {
        console.log('Fetching data')
        fetch('https://a487-38-13-189-73.ngrok.io/api/get-gps', {
            method: 'GET',
            headers: {
                "access-control-allow-origin" : "*",
                'Accept': 'application/json',
                'Content-type':'application/json'
            },
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res.json()
            }
        }).then(json => {
            console.log("Good JSON")
            console.log(json)
        }).catch(error => {
            console.log("Bad JSON")
            console.log(error)
        })
    }

    // useEffect(() => {
    //     handleGuestStudentButtonClick()
    // }, [])

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