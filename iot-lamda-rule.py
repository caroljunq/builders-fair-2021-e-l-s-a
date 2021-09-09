import json
import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'your_table_name'

def put_data(event):

    table = dynamodb.Table(table_name)
    
    utc_time = datetime(event["date_year"], event["date_month"], event["date_day"],event["time_hour"],event["time_minute"],event["time_second"]).strftime('%Y-%m-%d %H:%M:%S')
    date = datetime(event["date_year"], event["date_month"], event["date_day"]).strftime('%Y-%m-%d')

    response = table.put_item(
       Item={
        "client_id+device_name+date": event["client_id"]+"+"+event["device_name"]+"+"+date,
        "device_name": event["device_name"],
         "client_id": event["client_id"],
         "latitude": Decimal(str(event["latitude"])),
         "longitude": Decimal(str(event["longitude"])),
         "tempC": Decimal(str(event["tempC"])),
         "tempF": Decimal(str(event["tempF"])),
         "altitude": Decimal(str(event["altitude"])),
         "speed": Decimal(str(event["speed"])),
         "date": date,
         "hour": event["time_hour"],
         "timestamp": utc_time
    }
    )
    
def lambda_handler(event, context):
    put_data(event)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data Inserted!')
    }
    



