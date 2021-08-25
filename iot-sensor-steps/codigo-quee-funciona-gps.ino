
// Reference https://www.youtube.com/watch?v=VOJUV18BYE0
// REference https://github.com/ahmadlogs/arduino-ide-examples/tree/main/esp32-gps-tracker
#include <Wire.h>
#include <TinyGPS++.h>
//
//
//#define SCREEN_WIDTH 128 // OLED display width, in pixels
//#define SCREEN_HEIGHT 64 // OLED display height, in pixels

////On ESP32: GPIO-21(SDA), GPIO-22(SCL)
//#define OLED_RESET -1 //Reset pin # (or -1 if sharing Arduino reset pin)
//#define SCREEN_ADDRESS 0x3C //See datasheet for Address
//Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define RXD2 16
#define TXD2 17
HardwareSerial neogps(1);

TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);
  //Begin serial communication Arduino IDE (Serial Monitor)

  //Begin serial communication Neo6mGPS
  neogps.begin(9600, SERIAL_8N1, RXD2, TXD2);
  
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
//  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
//    Serial.println(F("SSD1306 allocation failed"));
//    for(;;); // Don't proceed, loop forever
//  }
//
//  display.clearDisplay();
//  display.display();
//  delay(2000);

}

void loop() {
    
//  boolean newData = false;
//  for (unsigned long start = millis(); millis() - start < 1000;){
    while (neogps.available())
    {
//      if (gps.encode(neogps.read())){
          byte x = neogps.read();
          Serial.write(x);
//      }
    }
  }