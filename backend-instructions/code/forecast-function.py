import json
import boto3

def lambda_handler(event, context):
    
    client = boto3.client('forecastquery')
    response = client.query_forecast(
        ForecastArn='arn:aws:forecast:us-east-1:107207751314:forecast/test_forecast',
        StartDate='2021-09-02T07:00:00',
        EndDate='2021-09-02T07:00:00',
        Filters={
            "item_id" : "0"
        }
    )
    return response
