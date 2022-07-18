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
#include "TFMini.h"
TFMini tfmini;

void getTFminiData(int* distance, int* strength){
  static char i =0;
  char j = 0;
  int checksum = 0;
  static int rx[9];
  if(Serial1.available()){
    rx[(unsigned char)i] = Serial1.read();
    if(rx[0] != 0x59){
      i = 0;
    }
    else if (i == 1 && rx[1] != 0x59){
      i = 0;
    }
    else if (i == 8){
      for(j = 0; j < 8; j++){
        checksum += rx[(unsigned char)j];
      }
      if (rx[8] == (checksum % 256)){
        *distance = rx[2] + rx[3] * 256;
        *strength = rx[4] + rx[5] * 256;
      }
      i = 0;
    }
    else {
      i++;
    }
  }
}

const char* deviceServiceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";
const char* deviceServiceCharacteristicUuid = "19b10001-e8f2-537e-4f6c-d104768a1214";

int gesture = -1;

BLEService gestureService(deviceServiceUuid); 
BLECharCharacteristic gestureCharacteristic(deviceServiceCharacteristicUuid, BLERead | BLEWrite);
BLECharacteristic stringCharacteristic( "1A3AC131-31EF-758B-BC51-54A61958EF82", BLERead | BLENotify, 20 );

String fileName = "test";
int counter = 0;

void setup() {

//  Serial.begin(115200);
//  // wait for serial port to connect. Needed for native USB port only
//  while (!Serial);
//     
//  Serial.println ("Initializing...");
  Serial1.begin(TFMINI_BAUDRATE);
  tfmini.begin(&Serial1);
  
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

  int distance = 0;
  int strength = 0;
  //Serial.print("here1");

  getTFminiData(&distance, &strength);
  //Serial.print("here4");
  while(!distance){
    //Serial.println("here5");
    getTFminiData(&distance, &strength);
    if(distance){
//      Serial.print(distance);
//      Serial.print("cm\t");
//      Serial.print("strength: ");
//      Serial.println(strength);
      break;
    }
  }
  //Serial.print("here2");
  if (central) {

    

    while (central.connected()) {
      digitalWrite(LEDR, LOW);
    digitalWrite(LEDG, LOW);
    digitalWrite(LEDB, HIGH);
      
         //char str[] = "test";
        const char* greeting = String(distance).c_str();
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
  //Serial.print("here3");
}
