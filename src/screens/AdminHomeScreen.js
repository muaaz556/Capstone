import React from 'react';

import { StyleSheet } from 'react-native';
import { Box, Button, Center, Text, View } from "native-base";

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center'
    }
})

const AdminHomeScreen = () => {
    return (
        <View style={styles.view}>
            <Center>
                <Text fontSize="2xl">
                    Welcome [ Admin User ]
                </Text>
            </Center>

            <Box w="100%" maxWidth="75%">
                <Button>Create New Building Mapping</Button>
            </Box>

            <Center>
                <Text fontSize="xl">
                    Select one of the following actions to perform
                </Text>
            </Center>
        </View>
    )
}

export default AdminHomeScreen;
