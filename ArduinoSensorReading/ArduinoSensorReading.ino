#include <SoftwareSerial.h>
#include "TFMini.h"

// Setup software serial port 
SoftwareSerial mySerial(2, 3);      // Uno RX (TFMINI TX), Uno TX (TFMINI RX)
TFMini tfmini;

void getTFminiData(int* distance, int* strength){
  static char i =0;
  char j = 0;
  int checksum = 0;
  static int rx[9];
  if(SerialTFMini.available()){
    rx[i] = SerialTFMini.read();
    if(rx[0] != 0x59){
      i = 0;
    }
    else if (i == 1 && rx[1] != 0x59){
      i = 0;
    }
    else if (i == 8){
      for(j = 0; j < 8; j++){
        checksum += rx[j];
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
void setup() {
  // Step 1: Initialize hardware serial port (serial debug port)
  Serial.begin(115200);
  // wait for serial port to connect. Needed for native USB port only
  while (!Serial);
     
  Serial.println ("Initializing...");
  SerialTFMini.begin(TFMINI_BAUDRATE);
  tfmini.begin(&SerialTFMini);
  // Step 2: Initialize the data rate for the SoftwareSerial port
//  mySerial.begin(TFMINI_BAUDRATE);

  // Step 3: Initialize the TF Mini sensor
  //tfmini.begin(&mySerial);    
}


void loop() {
  // Take one TF Mini distance measurement
//  uint16_t dist = tfmini.getDistance();
//  uint16_t strength = tfmini.getRecentSignalStrength();

  int distance = 0;
  int strength = 0;

  getTFMiniData(&distance, &strength);
  while(!distance){
    getTFMiniData(&distance, &strength);
    if(distance){
      Serial.print(distance);
      Serial.print("cm\t");
      Serial.print("strength: ");
      Serial.println(strength);
    }
  }

  // Display the measurement
//  Serial.print(dist);
//  Serial.print(" cm      sigstr: ");
//  Serial.println(strength);

  // Wait some short time before taking the next measurement
  delay(100);  
}
