# Once a day this code extracts the data for that day from dynamo and inserts the data into the data lake (data is partitioned)

import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime
from datetime import timedelta


dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')


# read the data of each device and stores it on s3
def read_device_data(device_name, client_id, date):
    partition_key = client_id+"+"+device_name+"+"+date
    csv_data = "device_id,client_name,timestamp,altitude,latitude,longitude,speed,tempC,tempF\n"
    print(partition_key)
    
    year,month,day = date.split("-")
    
    table_name = 'your-table-name'
    
    table = dynamodb.Table(table_name)
    
    response = table.query(
        KeyConditionExpression=Key('client_id+device_name+date_server').eq(partition_key)
    )
    print(len(response["Items"]))
    
    if len(response["Items"]) > 0:
        for item in response['Items']:
          csv_data += f"{item['device_name']},{item['client_id']},{item['timestamp_server']},{item['altitude']},{item['latitude']},{item['longitude']},{item['speed']},{item['tempC']},{item['tempF']}\n"
        
        # partitioning data
        s3.put_object(Body=csv_data, Bucket='your-bucket', Key=f'raw-data/client_id={client_id}/device_name={device_name}/year={year}/month={month}/day={day}/{client_id}_{device_name}_{date}.csv')

    
def get_device_list():
    
    table_name = 'your-table-of-devices'
    
    table = dynamodb.Table(table_name)
    
    response = table.scan()
    devices = set()
    
    print(len(response["Items"]))
    
    for item in response['Items']:
        devices.add((item["device_id"],item["client_id"]))
        
    return devices
    

def lambda_handler(event, context):
    
    device_list = get_device_list()
    
    # the codes runs every day 00:00, gets data from the day before
    current_date = datetime.now() - timedelta(days=1)
        
    current_date_string = current_date.strftime('%Y-%m-%d')
    
    for device_id,client_name in device_list:
        read_device_data(device_id, client_name, current_date_string)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data Created!')
    }