# THIS IS A TEMPORARY REPO

# Capstone Application
Please leave development details and specifics on how to utilize code from your module here!

## Deploying the App: Expo
Expo is currently being used for debugging and deployment to mobile devices.
The Expo app must be downloaded on the mobile device. This can be found on the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_CA&gl=US)

In the project, install Expo-CLI globally: `npm install --g expo-cli`

If installing for the first time, you will likely need to enable Administrative permissions.

The application can be deployed using `expo start`

If you have issues with the command above, try using `npx expo start`

This will place a QR code in console. Scan this code using the Expo app to begin debugging on your device.

## Text-to-Speech
The Text-to-Speech screen can be accessed from the "Text-to-Speech Screen" available on the homepage. This screen features a TextInput element where a sentence can be written, and a button labelled `TTS` that, when pressed, uses [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/) to synthesize and play audio from the written text.

To ensure the page functions properly, make sure the dependency is installed: `npm install expo-speech`

