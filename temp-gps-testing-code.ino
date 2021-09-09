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
#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>

// TinyGPS object
TinyGPSPlus gps;

Preferences preferences;

#define DEVICE_NAME "device_1"
#define CLIENT_ID "fake_clinic_1"


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

// ------------- temporary -----------
// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.print("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}


void publishMessage(double sensor_latitude, double sensor_longitude,float tempC, float tempF, float altid, float speed_km, 
int date_year,int date_month,int date_day,int time_hour,int time_minute,int time_second)
{
  Serial.println("maoe");
  StaticJsonDocument<512> doc;
  doc["device_name"] = DEVICE_NAME;
  doc["client_id"] = CLIENT_ID;
  doc["latitude"] = sensor_latitude;
  doc["longitude"] = sensor_longitude;
  doc["tempC"] = tempC;
  doc["tempF"] = tempF;
  doc["altitude"] = altid;
  doc["speed"] = speed_km;
  doc["date_year"] = date_year;
  doc["date_month"] = date_month;
  doc["date_day"] = date_day;
  doc["time_hour"] = time_hour;
  doc["time_minute"] = time_minute;
  doc["time_second"] = time_second;

//  const int BUFFER_SIZE = JSON_OBJECT_SIZE(12);
//  Serial.println(BUFFER_SIZE);
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  Serial.println("222");
}

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

//  StaticJsonDocument<200> doc;
//  deserializeJson(doc, payload);
//  const char* message = doc["message"];
}

// --- temporary -----------------



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
  connectAWS();  

}

unsigned long previousMillis = 0;

void loop() {
  unsigned long currentMillis = millis();
  // each 30 seconds send data to AWS
//  unsigned long interval = 15000;
//  if (currentMillis - previousMillis >= interval) {
    // save the time you should have toggled the LED
    previousMillis += interval;
  // waiting data on gps is available
  while (neogps.available()){
      if (gps.encode(neogps.read())){
        // if device restarts force the temperature sensor gets the current value everytime
        sensors.requestTemperatures();

        // Information Collected
        double latitude = gps.location.lat();
        double longitude = gps.location.lng();
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
        if (!client.connected()){
          Serial.println("MQTT connection lost, connecting again");
          connectAWS();
          publishMessage(latitude,longitude,temperatureC,temperatureF,altitd_meters,speed_km_h,date_year,date_month,date_day,time_hour,time_minute,time_second);               
        }else{
          publishMessage(latitude,longitude,temperatureC,temperatureF,altitd_meters,speed_km_h,date_year,date_month,date_day,time_hour,time_minute,time_second);               
        }
        break;
      }
   }
  }  
}