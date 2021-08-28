// Code References
// https://randomnerdtutorials.com/guide-to-neo-6m-gps-module-with-arduino/
// https://randomnerdtutorials.com/esp32-ds18b20-temperature-arduino-ide/
// http://arduiniana.org/libraries/tinygpsplus/ 
// https://github.com/ahmadlogs/arduino-ide-examples/tree/main/esp32-gps-tracker

// Required libs
#include <OneWire.h>
#include <DallasTemperature.h>
#include <TinyGPS++.h>
#include <Preferences.h>

// TinyGPS object
TinyGPSPlus gps;

Preferences preferences; 

// Pin on ESp32
static const int RXPin = 16, TXPin = 17;
// Frequency transmission for GPS sensor
static const uint32_t GPSBaud = 9600;

// Using Serial Hardware to send message to ESP32
HardwareSerial neogps(1);


// GPIO where the DS18B20 Temperature sensor is connected to
const int oneWireBus = 4;     

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);


void setup() {
  preferences.end();
  preferences.begin("my-app", false);
  // Start the Serial Monitor
  Serial.begin(115200);
  
  // Start the Temperature sensor
  sensors.begin();
  //sensors.setWaitForConversion(true); 
  delay(1000);

  sensors.requestTemperatures();

  // Start GPS sensor
  neogps.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);
  
}

void loop() {

  // waiting data on gps is available
  while (neogps.available()){
      if (gps.encode(neogps.read())){
        // if device restarts force the temperature sensor gets the current value everytime
        sensors.requestTemperatures();

        // Information Collected
        float latitude = gps.location.lat();
        float longitude = gps.location.lng();
        float altitd_meters = gps.altitude.meters();
        float speed_km_h = gps.speed.kmph();
        int date_year = gps.date.year();
        int date_month = gps.date.month();
        int date_day = gps.date.day();
        int time_hour = gps.time.hour();
        int time_minute = gps.time.minute();
        int time_second = gps.time.second();
        float temperatureC = sensors.getTempCByIndex(0);
        float temperatureF = sensors.getTempFByIndex(0);
        Serial.print("Latitude="); 
        Serial.println(latitude,6);
        Serial.print("Longitude="); 
        Serial.println(longitude,6);
        Serial.print("Altitude=");  
        Serial.println(altitd_meters);
        Serial.print(temperatureC);
        Serial.println("ºC");
        Serial.print(temperatureF);
        Serial.println("ºF");
        Serial.println(" ");          
      }
   }
  
}