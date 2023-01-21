import { Alert } from "react-native";

export const displayTextAlert = (title, body) => {
    Alert.alert(title, body, [
      {
        text: 'Ok',
        style: 'cancel',
      }
    ]);
  }