/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import { StyleSheet, Image } from 'react-native';
import { Box, Button, Center, Text, View } from "native-base";

const styles = StyleSheet.create({ });

const FloorMappingScreen = () => {
    const [photo, setPhoto] = useState(null);
    let choosePhotoHandler = () => {
        const options = {
            noData: true,
        };
        launchImageLibrary(options, response => {
            if (response.assets[0].uri) {
                setPhoto(response.assets[0]);
            }
        });
    }
    return (
        <View style={styles.view} height="100%">
            {/* <Center>
                <Text fontSize="2xl">
                    Mapping Page
                </Text>
            </Center> */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {photo && (
                    <Image
                        source={{ uri: photo.uri }}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
                <Button title="Choose Photo" onPress={choosePhotoHandler} />
            </View>
            {/* <View>
                <Box bg="primary.400" borderRadius="5" rounded="md" height="70%" width="20%" mt="10">
                    <Text color="white">Option 1</Text>
                    <Text color="white">Option 2</Text>
                    <Text color="white">Option 3</Text>
                </Box>
            </View> */}
        </View>
    )
}

export default FloorMappingScreen;