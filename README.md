# LATAM Builders Fair 2021 - E.L.S.A

![ELSA Architecture](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/elsa-logo.png)
Feel Frozen!


E.L.S.A is a solution that helps to monitor one of the most important steps for vaccines - transportation delivery. The solution provides information about package location and temperature. Using ML and analytics services, E.L.S.A. shows near real-time dashboards about vaccines’ package status and location, and alerts the stackholders (managers, truck drivers, etc.) if there is a problem with the package (ex: high temperatures, location audit).


## Architecture
The architecture is entire serverless needing less effort to the maintanence enabling the user focus on the business and application purpose.

![ELSA Architecture](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/arch-elsa.png)

1. The telemetry data (temperature and geolocation) is collected by an IoT sensor develop by the team.
2. The data is posted on Amazon IoT Core by MQTT.
3. IoT Core triggers a Lambda function that process part of the data and puts on DynamoDB
4. The data is consumed in near realtime (20 seconds of latency) through an application developed in Angular and hosted on Amplify. The information is stored on DynamoDB and exposed to the website by Lambda and API Gateway
5. Once a day the data from dynamo is extracted to the data lake by a Lambda. The process is controlled by Step Functions.
6. After the extraction, Step Function calls a Lambda that starts Glue Crawler to catalog the new data on data lake in S3
7. Step Functions calls another Lambda to train the model of Forecast with the daily data collected
8. The historic data on data lake is presented to user through Quicksight embeded feature on the Angular web app. The real time data is presented through a chart library for javascript.
9. The data on forecast is updated each 5 minutes by a schedule Lambda. 
10. An event scheduled on CloudWatch, calls a lambda every 5 minutes to check the last temperatures. Lambda submits the data to Forecast to predict the future temperature. If Forecast returns a temperateure higher than the limit stablished, a Lambda
calls SNS to send a SMS message of alert to user.

## Reproduce the solution!!

The architecture can be divided in 3 parts:
- [IoT](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/iot/1-introduciton-iot-module.md)
    - [Preparation to build the module](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/iot/1-introduciton-iot-module.md)
    - [Building the sensor](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/iot/2-building-sensor-device-esp32.md)
    - [Connect to AWS](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/iot/3-connecting-with-aws.md)
- [Analytics and ML](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/analytics-ml/1-analytics-services-on-aws.md)
- [Application](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/blob/main/application-steps/1-building-running-application.md) 
- [Scripts folder](https://github.com/caroljunq/builders-fair-2021-e-l-s-a/tree/main/scripts) Codes for sensor and for lambdas and APIs you can use

Each section above contains instructions and steps to reproduce the solution.


## Future ideas
This solution was applied for vaccines delivery, but it can be applied in other scenarios. Examples:
- Monitoring logistics of food
- Telemetry of food delivery by restaurants and business
- Add more sensor like vibration and stablish optimal routes based on information
- Identify the quality of transportation routes --> vibration, temperature, moisture, speed
- Agriculture
- etc.
