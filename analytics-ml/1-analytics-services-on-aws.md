# Handle with sensor data - Analytics and ML
In this project, we used some AWS services to collect, store, process, analyse, and expose the data. As an action based on data produced by the sensors, we used ML services to help the users of the solution.

## Collect Data
To collect data we used IoT core by MQTT Topic. Depending what type of data source we can use other tools like streams, database migration services, etc.
-  [Easily ingest data into AWS for building data lakes, archiving, and more](https://aws.amazon.com/blogs/storage/easily-ingest-data-into-aws-for-building-data-lakes-archiving-and-more/)
-  [Kinesis family](https://aws.amazon.com/kinesis/?nc1=h_ls)
-  [Patterns for AWS IoT time series data ingestion with Amazon Timestream](https://aws.amazon.com/blogs/database/patterns-for-aws-iot-time-series-data-ingestion-with-amazon-timestream/)
-  [Data ingestion using AWS Step Functions, AWS IoT Events, and AWS IoT Analytics](https://aws.amazon.com/blogs/iot/data-ingestion-using-aws-step-functions-aws-iot-events-and-aws-iot-analytics/)

## Store data
To store data, we used DynamoDb a non sql low latency database, and data lake with S3 (object storage). Dynamo can provides a low latency response ideal for IoT. It is serverless no need to maintain virtual machines.

Data Lake is a place where you can store any kind of data. In this case, S3 can be a place to store historic data and purge cold data from Dynamo to optimize storage costs.
- [Data lakes AWS](https://aws.amazon.com/big-data/datalakes-and-analytics/?nc1=h_ls)
- [Integrating IoT data with your data lake with new AWS IoT Analytics features](https://aws.amazon.com/blogs/iot/integrating-iot-data-with-your-data-lake-with-new-aws-iot-analytics-features/)
- [DynamoDB and IoT](https://aws.amazon.com/dynamodb/iot/?nc1=h_ls)

There are other types of storage that can help like [Amazon Timestream](https://aws.amazon.com/timestream/?nc1=h_ls) which is a fast, scalable, and serverless time series database service for IoT and operational applications that makes it easy to store and analyze trillions of events per day up to 1,000 times faster and at as little as 1/10th the cost of relational databases. Other example is [Opensearch](https://aws.amazon.com/opensearch-service/?nc1=h_ls) which enables analyses in near realtime, and a powerful query engine.

## Process and orchestration
We used Lambda to process data when it arrives from IoT device, to export to data lake, and to process data to be in Forecast format.
We also used Lambda to expose data from Dynamo through Api Gateway, and to create automations.
All the Lambda executions were orchestrated by Step Functions and CloudWatch events.

There is a Lambda scheduled to extract data from Dynamo, and to process data to Forecast.

Another services that can help with ETL for IoT data: Glue, and EMR.

- [Orchestrate multiple ETL jobs using AWS Step Functions and AWS Lambda](https://aws.amazon.com/blogs/big-data/orchestrate-multiple-etl-jobs-using-aws-step-functions-and-aws-lambda/)
- [Step Functions](https://aws.amazon.com/step-functions/?nc1=h_ls)
- [Glue Streaming](https://docs.aws.amazon.com/glue/latest/dg/add-job-streaming.html)
- [Real-time bushfire alerting with Complex Event Processing in Apache Flink on Amazon EMR and IoT sensor network](https://aws.amazon.com/blogs/big-data/real-time-bushfire-alerting-with-complex-event-processing-in-apache-flink-on-amazon-emr-and-iot-sensor-network/)

To explore data or create jobs on notebook environment it is possible to use [EMR Studio](https://aws.amazon.com/emr/features/studio/), [EMR Notebooks](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-notebooks.html), [SageMaker Studio](https://aws.amazon.com/sagemaker/studio/).

## Analyse and expose
To analyse the data we show the historic data through Quicksgiht embeded feature and [Apex chart library](https://apexcharts.com/docs/angular-charts/) for near real time data. Athena is used as intermediary to allow Quicksight make queries SQL on S3 data lake without the need to create a manifest file.

To embed dashboard, we used an anonymous mode of Quicksight which allows you to embed dashboard url on your appliation. 

We used a Lambda to get embed url from Quicksight API. When the user goes to historic tab in the web application, the front-end makes a rest call to API Gateway on AWS. API Gateway calls Lambda, then Lambda runs and calls Quicksight API to get the URL. Lambda returns the URL, then application embed the dashboard on page.


- [Tutorial Anonymous Embeding Quicksight](https://learnquicksight.workshop.aws/en/anonymous-embedding.html)
- [Tutorial doc Anonymous Quicksight](https://learnquicksight.workshop.aws/en/anonymous-embedding.html)
- [Quicksight SDK for javascript](https://www.npmjs.com/package/amazon-quicksight-embedding-sdk)
- [Monitor and visualise building occupancy with AWS IoT Core, Amazon QuickSight and Raspberry Pi](https://aws.amazon.com/blogs/iot/monitor-and-visualise-building-occupancy-with-aws-iot-core-amazon-quicksight-and-raspberry-pi/)
- [Apex charts](https://apexcharts.com/docs/angular-charts/)

To expose the data to the front-end, we used API Gateway and Lambda.

# Machine Learning - Amazon Forecast
Based on IoT, we can take actions. We used IoT data to alert managers, truckers, users of temperature possible increase through ML forecast.

We used Amazon Forecast which does not require ML knowledge or develop a machine learning model. Forecast only needs data to train, validate, and keep the model up to date to reflect reality.

We extracted the data from DynamoDB to S3, then we process the data to input on Forecast format. We used the data to train Forecast, to validate the model, and to keep up to date.

Each 5 minutes Forecast with Lambda calls checks if the prediction indicates a high temperature in the near feature, if it detects, Lambda calls SNS service to send a SMS to the user.

- [Using AWS IoT for Predictive Maintenance](https://aws.amazon.com/blogs/iot/using-aws-iot-for-predictive-maintenance/)
- [Making accurate energy consumption predictions with Amazon Forecast](https://aws.amazon.com/blogs/machine-learning/making-accurate-energy-consumption-predictions-with-amazon-forecast/)
- [Automating your Amazon Forecast workflow with Lambda, Step Functions, and CloudWatch Events rule](https://aws.amazon.com/blogs/machine-learning/automating-your-amazon-forecast-workflow-with-lambda-step-functions-and-cloudwatch-events-rule/)

Another way to deploy custom models is [SageMaker](https://aws.amazon.com/pm/sagemaker/).




