# Connecting IoT Device with AWS IoT Core
To ingest data from IoT devices, you can use [AWS IoT Core](https://aws.amazon.com/iot-core/?nc1=h_ls) which lets you connect billions of IoT devices and route trillions of messages to AWS services without managing infrastructure. 

We used IoT Core to collect data from the sensor by MQTT protocol. 

## 5- Register IoT Device
- The first step to ingest data is to register a device on IoT Core. You can follow these steps - https://www.youtube.com/watch?v=6w9a6y_-T2o (video 7 min).
Another way is to register a thing as in this blogpost https://aws.amazon.com/blogs/compute/building-an-aws-iot-core-device-using-aws-serverless-and-an-esp32/.
- Ways to connecto to IoT Core - https://docs.aws.amazon.com/iot/latest/developerguide/connect-to-iot.html
- In this project, we used IoT endpoints
- When you register a thing, you will need generate certificates and store safely part of these certificates on ESP32. There are security modules that can help encrypt this type of data to create security layers. In this case, we used a secrets.h as in the blogpost https://aws.amazon.com/blogs/compute/building-an-aws-iot-core-device-using-aws-serverless-and-an-esp32/.

## 6- Setup Iot Rules and Lambda
In the Iot Core, you can set up an IoT Rule to using SQL to decide what you do with data receive on MQTT topics. There are diferent actions you can do with Iot Rules: filter data, invoke Lambda, insert data on DynamoDB, send data to Opensearch (elasticsearch), etc - https://docs.aws.amazon.com/iot/latest/developerguide/iot-rules.html
- Tutorial how to create IoT Rule - https://www.youtube.com/watch?v=JD16rVBUF-8 (9 min video)

We created an IoT rule that receives the data, sends it to Lambda. Lambda function transforms and prepared data, then insert it in DynamoDB. The data is sent to MQTT topic in IoT Core each 15-30seconds by ESP32.

## Tips
AWS has other IoT services that can help you to collect, analyse, transform, sync data, etc - https://aws.amazon.com/iot/?nc1=h_ls