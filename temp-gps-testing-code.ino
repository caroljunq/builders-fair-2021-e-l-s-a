
#include <OneWire.h>
#include <DallasTemperature.h>
#include <TinyGPS++.h>

TinyGPSPlus gps;

static const int RXPin = 16, TXPin = 17;
static const uint32_t GPSBaud = 9600;

HardwareSerial neogps(1);


// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;     

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);


void setup() {

// Start the Serial Monitor
  Serial.begin(115200);
  // Start the DS18B20 sensor
  sensors.begin();

  neogps.begin(GPSBaud, SERIAL_8N1, RXPin, TXPin);


}

void loop() {

  while (neogps.available()){
      if (gps.encode(neogps.read())){
        float latitude = gps.location.lat();
        float longitude = gps.location.lng();
        Serial.print("Latitude="); 
        Serial.println(latitude,6);
        Serial.print("Longitude="); 
        Serial.println(longitude,6);
        
        sensors.requestTemperatures(); 
        float temperatureC = sensors.getTempCByIndex(0);
        float temperatureF = sensors.getTempFByIndex(0);
        Serial.print(temperatureC);
        Serial.println("ºC");
        Serial.print(temperatureF);
        Serial.println("ºF");
          
      }
   }
  
}