/*
  BLE_Peripheral.ino

  This program uses the ArduinoBLE library to set-up an Arduino Nano 33 BLE 
  as a peripheral device and specifies a service and a characteristic. Depending 
  of the value of the specified characteristic, an on-board LED gets on. 

  The circuit:
  - Arduino Nano 33 BLE. 

  This example code is in the public domain.
*/

#include <ArduinoBLE.h>

const char* deviceServiceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";
const char* deviceServiceCharacteristicUuid = "19b10001-e8f2-537e-4f6c-d104768a1214";

int gesture = -1;

BLEService gestureService(deviceServiceUuid); 
BLECharCharacteristic gestureCharacteristic(deviceServiceCharacteristicUuid, BLERead | BLEWrite);
BLECharacteristic stringCharacteristic( "1A3AC131-31EF-758B-BC51-54A61958EF82", BLERead | BLENotify, 20 );

String fileName = "test";
int counter = 0;

void setup() {
  
  pinMode(LEDR, OUTPUT);
  pinMode(LEDG, OUTPUT);
  pinMode(LEDB, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  
  digitalWrite(LEDR, HIGH);
  digitalWrite(LEDG, HIGH);
  digitalWrite(LEDB, HIGH);
  digitalWrite(LED_BUILTIN, LOW);

  
  if (!BLE.begin()) {
    while (1);
  }
  

  BLE.setLocalName("NanoBLE");
  BLE.setAdvertisedService(gestureService);
  gestureService.addCharacteristic(gestureCharacteristic);
  gestureService.addCharacteristic(stringCharacteristic);
  BLE.addService(gestureService);
  gestureCharacteristic.writeValue('A');
  char* greeting = "Hello World!";
  stringCharacteristic.writeValue(greeting);
  BLE.advertise();
}

void loop() {
  BLEDevice central = BLE.central();
  delay(10);
  counter++;
  if(counter > 9) counter = 0;

  if (central) {

    

    while (central.connected()) {
      digitalWrite(LEDR, LOW);
    digitalWrite(LEDG, LOW);
    digitalWrite(LEDB, HIGH);
      
         //char str[] = "test";
        const char* greeting = String(counter).c_str();
        stringCharacteristic.writeValue(greeting);
//      if (gestureCharacteristic.written()) {
//         gesture = gestureCharacteristic.value();
//         writeGesture(gesture);
//       }
    }
    digitalWrite(LEDR, HIGH);
    digitalWrite(LEDG, HIGH);
    digitalWrite(LEDB, HIGH);
  }
}
