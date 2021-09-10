import json
import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'iot-sensors-data'

def put_data(event):
    print(event)
    table = dynamodb.Table(table_name)
    
    # Sensor Data
    timestamp_sensor_utc = datetime(event["date_year"], event["date_month"], event["date_day"],event["time_hour"],event["time_minute"],event["time_second"]).strftime('%Y-%m-%d %H:%M:%S')
    date_sensor_utc = datetime(event["date_year"], event["date_month"], event["date_day"]).strftime('%Y-%m-%d')
    
    # Timestamp Server
    date_server_utc = datetime.now().strftime('%Y-%m-%d')
    timestamp_server_utc = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(timestamp_server_utc)
    response = table.put_item(
      Item={
        "client_id+device_name+date_server": event["client_id"]+"+"+event["device_name"]+"+"+date_server_utc,
        "device_name": event["device_name"],
        "client_id": event["client_id"],
        "latitude": Decimal(str(event["latitude"])),
        "longitude": Decimal(str(event["longitude"])),
        "tempC": Decimal(str(event["tempC"])),
        "tempF": Decimal(str(event["tempF"])),
        "altitude": Decimal(str(event["altitude"])),
        "speed": Decimal(str(event["speed"])),
        "date_sensor": date_sensor_utc,
        "timestamp_sensor": timestamp_sensor_utc,
        "date_server": date_server_utc,
        "timestamp_server": timestamp_server_utc
    })
    
def lambda_handler(event, context):
    put_data(event)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data Inserted!')
    }