import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime
from datetime import timedelta


dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')


# read the data of each device and stores it on s3
def read_device_data(partition_key,date_range):
    table_name = 'your-table-name-iot-data'
    
    table = dynamodb.Table(table_name)
    
    response = table.query(
        KeyConditionExpression=Key('client_id+device_name+date_server').eq(partition_key) & Key('timestamp_server').gte(date_range)
    )

    
    return response['Items']


def lambda_handler(event, context):
    
    print(event)
    
    device_name = event["device_name"]
    client_name =  event["client_name"]
    selected_date = event["date"]
    partition_key = client_name+"+"+device_name+"+"+selected_date
    
    # get data in brt time and get the last 10 minutes
    current_date = datetime.now() - timedelta(hours=3) - timedelta(minutes=10)
    
    current_date_string = current_date.strftime('%Y-%m-%d %H:%M:%S')
    
    print(current_date_string)

    results = read_device_data(partition_key,current_date_string)
    
    listinfos = [
        {
            'temp':str(float("{:.2f}".format(item['tempC']))),
            'altitude':str(float("{:.2f}".format(item['altitude']))),
            'timestamp':item["timestamp_server"],
            "lat":item["latitude"],"long":item["longitude"],
            "speed":str(float("{:.2f}".format(item['speed']))) } for item in results]
    
    return {
        'statusCode': 200,
        'body': listinfos,
        'header': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    }