import React, { useEffect } from 'react';
import { RNCamera } from 'react-native-camera';

const CameraScreen = () => {
    return (
        <RNCamera 
            ref={ref => { this.camera = ref }}
            captureAudio={ false }
            style={{ flex: 1 }}
            type={ RNCamera.Constants.Type.back }
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
        />
    )
}

export default CameraScreen;
