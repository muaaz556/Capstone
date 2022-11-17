import React from 'react';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from "native-base";

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center'
    }
})

const AdminHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.view}>
            <Center>
                <Text fontSize="2xl">
                    Welcome [ Admin User ]
                </Text>
            </Center>

            <Box w="100%" maxWidth="75%" mt="5">
                <Button mb="2">Create New Mapping</Button>
                <Button mb="2">View Existing Mappings</Button>
                <Button onPress={() => navigation.navigate('GPSTestScreen')}>Test GPS</Button>
            </Box>
            
        </View>
    )
}

export default AdminHomeScreen;
