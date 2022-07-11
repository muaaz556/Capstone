int dist;
int strength;
int check;
int i;
int uart[9];
const int HEADER = 0x59;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial1.begin(115200);

}

void loop() {
  // put your main code here, to run repeatedly:
  if(Serial1.available()){
    Serial.print("BRUHHHHH ITS AVAILABLE");
    Serial.print(Serial.read());
    if(Serial1.read() == HEADER){
      uart[0] = HEADER;
      if(Serial1.read() == HEADER){
        uart[1] = HEADER;
        for(int i = 2; i < 9; i++){
          uart[i] = Serial1.read();
        }
        check = uart[0] + uart[1] + uart[2] + uart[3] + uart[4] + uart[5] + uart[6] + uart[7];
        if(uart[8] == (check & 0xff)){
          dist = uart[2] + uart[3] + 256;
          strength = uart[4] = uart[5]*256;
          Serial.print("dist: ");
          Serial.print(dist);
          Serial.print("cm\t");
          Serial.print("strength: ");
          Serial.println(strength);
        }
      }
    }
  }
}
