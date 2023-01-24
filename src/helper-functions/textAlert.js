import { Alert } from "react-native";

export const displayTextAlert = (title, body) => {
    Alert.alert(title, body, [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ]);
  }

  export const displayTextAlertClear = (title, body, onPressOk) => {
    Alert.alert(title, body, [
      {
        text: 'Ok',
        onPress: () => onPressOk(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      }
    ]);
  }

  export const displayTextAlertNext = (title, body, onPressOk) => {
    Alert.alert(title, body, [
      {
        text: 'Ok',
        onPress: () => onPressOk(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      }
    ]);
  }