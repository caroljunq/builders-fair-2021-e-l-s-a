#include <pgmspace.h>

#define SECRET
#define THINGNAME "your-esp32-name"

const char WIFI_SSID[] = "your-wifi-name";
const char WIFI_PASSWORD[] = "password";
const char AWS_IOT_ENDPOINT[] = "iot-endpoint";

// Amazon Root CA 1
static const char AWS_CERT_CA[] PROGMEM = R"";

// Device Certificate
static const char AWS_CERT_CRT[] PROGMEM = R"";

// Device Private Key
static const char AWS_CERT_PRIVATE[] PROGMEM = R"";
