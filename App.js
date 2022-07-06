// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, { useState } from 'react';
// import type {Node} from 'react';
// import RNLocation from 'react-native-location';
// import { LogBox } from 'react-native';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   Button,
// } from 'react-native';
// // import moment from "moment";

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// LogBox.ignoreLogs(['new NativeEventEmitter']);

// RNLocation.configure({
//   distanceFilter: 0,
//   interval: 5000,
//   maxWaitTime: 5000,
// })


// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   // const [count, setCount] = useState([]);
  
  
//   // //source: https://github.com/emmaodia/logRocket/blob/main/ReactNativeGeolocation/App.js
//   // const getLocation = async () => {
    
//   //   let permission = await RNLocation.checkPermission({
//   //     ios: 'whenInUse', // or 'always'
//   //     android: {
//   //       detail: 'fine' // or 'fine'
//   //     }
//   //   });
  
//   //   console.log(permission)
  
//   //   let location;
//   //   if(!permission) {
//   //     permission = await RNLocation.requestPermission({
//   //       ios: "whenInUse",
//   //       android: {
//   //         detail: "fine",
//   //         rationale: {
//   //           title: "We need to access your location",
//   //           message: "We use your location to show where you are on the map",
//   //           buttonPositive: "OK",
//   //           buttonNegative: "Cancel"
//   //         }
//   //       }
//   //     })
//   //     console.log(permission)
//   //     location = await RNLocation.getLatestLocation({timeout: 100})
//   //     console.log(location)
//   //     setCount(location)
      
//   //   } else {
//   //     location = await RNLocation.getLatestLocation({timeout: 100})
//   //     console.log(location)
//   //     setCount(location)
//   //   }
//   // }

//   const [count, setCount] = useState([]);
  
  
//   //source: https://github.com/emmaodia/logRocket/blob/main/ReactNativeGeolocation/App.js
//   const getLocation = async () => {
    
//     // let permission = await RNLocation.checkPermission({
//     //   ios: 'whenInUse', // or 'always'
//     //   android: {
//     //     detail: 'fine' // or 'fine'
//     //   }
//     // });
  
//     // console.log(permission)
//     let permission = await RNLocation.checkPermission({
//       ios: 'whenInUse', // or 'always'
//       android: {
//         detail: 'fine' // or 'fine'
//       }
//     });
  
//     console.log(permission)
  
//     let location;
//     if(!permission) {
//       permission = await RNLocation.requestPermission({
//         ios: "whenInUse",
//         android: {
//           detail: "fine",
//           rationale: {
//             title: "We need to access your location",
//             message: "We use your location to show where you are on the map",
//             buttonPositive: "OK",
//             buttonNegative: "Cancel"
//           }
//         }
//       })
//       console.log(permission)
//       // location = await RNLocation.getLatestLocation({timeout: 100})
//       _startUpdatingLocation()
//       // console.log(location)
//       // setCount(location)
      
//     } else {
//       // location = await RNLocation.getLatestLocation({timeout: 100})
      
//       _startUpdatingLocation()
//       // console.log(location)
//       // setCount(location)
//     }
  
//     // let location;
//     // RNLocation.requestPermission({
//     //   ios: "whenInUse",
//     //   android: {
//     //     detail: "fine",
//     //     rationale: {
//     //       title: "Location permission",
//     //       message: "We use your location to demo the library",
//     //       buttonPositive: "OK",
//     //       buttonNegative: "Cancel"
//     //     }
//     //   }
//     // }).then(granted => {
//     //   if (granted) {
//     //     this._startUpdatingLocation();
//     //   }
//     // });
//   }

//   _startUpdatingLocation = () => {
//     RNLocation.subscribeToLocationUpdates(
//       locations => {
//         console.log("Inside start")
//         console.log(locations[0])
//         setCount(locations[0])
//         // this.setState({ location: locations[0] });
//       }
//     );
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         {/* <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Hello World 2">
//             This is a basic react app.
//           </Section>
//         </View>*/
//         <View style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
//        <Button title="Get Location"
//    onPress={getLocation}
//  />
//      </View> }
//      <Text>Latitude: {count.longitude} </Text>
//     <Text>Longitude: {count.latitude} </Text>
    
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

//Code Source: https://github.com/timfpark/react-native-location
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import RNLocation from "react-native-location";
// import moment from "moment";

const repoUrl = "https://github.com/timfpark/react-native-location";

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      location: null
    };
  }

  componentWillMount() {
    RNLocation.configure({
      distanceFilter: 5.0
    });
    
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine",
        rationale: {
          title: "Location permission",
          message: "We use your location to demo the library",
          buttonPositive: "OK",
          buttonNegative: "Cancel"
        }
      }
    }).then(granted => {
      if (granted) {
        this._startUpdatingLocation();
      }
    });
  }

  _startUpdatingLocation = () => {
    this.locationSubscription = RNLocation.subscribeToLocationUpdates(
      locations => {
        this.setState({ location: locations[0] });
      }
    );
  };

  _stopUpdatingLocation = () => {
    this.locationSubscription && this.locationSubscription();
    this.setState({ location: null });
  };

  _openRepoUrl = () => {
    Linking.openURL(repoUrl).catch(err =>
      console.error("An error occurred", err)
    );
  };

  render() {
    const { location } = this.state;
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Text style={styles.title}>react-native-location</Text>
            <TouchableHighlight
              onPress={this._openRepoUrl}
              underlayColor="#CCC"
              activeOpacity={0.8}
            >
              <Text style={styles.repoLink}>{repoUrl}</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.row}>
            <TouchableHighlight
              onPress={this._startUpdatingLocation}
              style={[styles.button, { backgroundColor: "#126312" }]}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this._stopUpdatingLocation}
              style={[styles.button, { backgroundColor: "#881717" }]}
            >
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableHighlight>
          </View>

          {location && (
            <React.Fragment>
              <View style={styles.row}>
                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Course</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.course}
                  </Text>
                </View>

                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Speed</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.speed}
                  </Text>
                </View>

                <View style={[styles.detailBox, styles.third]}>
                  <Text style={styles.valueTitle}>Altitude</Text>
                  <Text style={[styles.detail, styles.largeDetail]}>
                    {location.altitude}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-start" }}>
                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Latitude</Text>
                    <Text style={styles.detail}>{location.latitude}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Longitude</Text>
                    <Text style={styles.detail}>{location.longitude}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Accuracy</Text>
                    <Text style={styles.detail}>{location.accuracy}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Altitude Accuracy</Text>
                    <Text style={styles.detail}>
                      {location.altitudeAccuracy}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Timestamp</Text>
                    <Text style={styles.detail}>{location.timestamp}</Text>
                  </View>

                  <View style={[styles.detailBox, styles.half]}>
                    <Text style={styles.valueTitle}>Date / Time</Text>
                    <Text style={styles.detail}>
                      {/* {moment(location.timestamp).format("MM-DD-YYYY h:mm:ss")} */}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.detailBox, styles.full]}>
                    <Text style={styles.json}>{JSON.stringify(location)}</Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          )}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCCCCC"
  },
  innerContainer: {
    marginVertical: 30
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  },
  repoLink: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#0000CC",
    textDecorationLine: "underline"
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5
  },
  detailBox: {
    padding: 15,
    justifyContent: "center"
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  buttonText: {
    fontSize: 30,
    color: "#FFFFFF"
  },
  valueTitle: {
    fontFamily: "Futura",
    fontSize: 12
  },
  detail: {
    fontSize: 15,
    fontWeight: "bold"
  },
  largeDetail: {
    fontSize: 20
  },
  json: {
    fontSize: 12,
    fontFamily: "Courier",
    textAlign: "center",
    fontWeight: "bold"
  },
  full: {
    width: "100%"
  },
  half: {
    width: "50%"
  },
  third: {
    width: "33%"
  }
});
