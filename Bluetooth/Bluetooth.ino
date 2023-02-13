#include <ArduinoBLE.h>
#include "TFMini.h"
TFMini tfmini;

const char *deviceServiceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";
const char *deviceServiceCharacteristicUuid = "1A3AC131-31EF-758B-BC51-54A61958EF82";

BLEService gestureService(deviceServiceUuid);
BLECharacteristic stringCharacteristic(deviceServiceCharacteristicUuid, BLERead | BLENotify, 20);

void setup()
{
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

    if (!BLE.begin())
    {
        while (1)
            ;
    }

    BLE.setLocalName("NanoBLE");
    BLE.setAdvertisedService(gestureService);
    gestureService.addCharacteristic(stringCharacteristic);
    BLE.addService(gestureService);
    BLE.advertise();
}

void loop()
{
    BLEDevice central = BLE.central();
    delay(10);

    int distance = 0;
    int strength = 0;

    //  getTFminiData(&distance, &strength);
    //  while(!distance){
    //    getTFminiData(&distance, &strength);
    //    if(distance){
    //      break;
    //    }
    //  }

    if (central)
    {
        while (central.connected())
        {
            digitalWrite(LEDR, LOW);
            digitalWrite(LEDG, HIGH);
            digitalWrite(LEDB, LOW);

            getTFminiData(&distance, &strength);
            while (!distance)
            {
                getTFminiData(&distance, &strength);
                if (distance)
                {
                    break;
                }
            }

            const char *greeting = String(distance).c_str();
            stringCharacteristic.writeValue(greeting);
        }
        digitalWrite(LEDR, HIGH);
        digitalWrite(LEDG, HIGH);
        digitalWrite(LEDB, HIGH);
    }
}

void getTFminiData(int *distance, int *strength)
{
    static char i = 0;
    char j = 0;
    int checksum = 0;
    static int rx[9];
    if (Serial1.available())
    {
        rx[(unsigned char)i] = Serial1.read();
        if (rx[0] != 0x59)
        {
            i = 0;
        }
        else if (i == 1 && rx[1] != 0x59)
        {
            i = 0;
        }
        else if (i == 8)
        {
            for (j = 0; j < 8; j++)
            {
                checksum += rx[(unsigned char)j];
            }
            if (rx[8] == (checksum % 256))
            {
                *distance = rx[2] + rx[3] * 256;
                *strength = rx[4] + rx[5] * 256;
            }
            i = 0;
        }
        else
        {
            i++;
        }
    }
}