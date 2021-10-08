# This code inserts the data received from the sensor into DynamoDb

import json
import boto3
from datetime import datetime
from datetime import timedelta
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'dynamo-your-table-name'

def put_data(event):

    table = dynamodb.Table(table_name)
    
    # subtract - 3 hours converting to BRT Time
    timestamp_server_utc = datetime.now()
    timestamp_server_converted_brt = timestamp_server_utc - timedelta(hours=3)
    date_server_converted_brt = timestamp_server_converted_brt.strftime('%Y-%m-%d')
    timestamp_server_string =  timestamp_server_converted_brt.strftime('%Y-%m-%d %H:%M:%S')


    response = table.put_item(
      Item={
        "client_id+device_name+date_server": event["client_id"]+"+"+event["device_name"]+"+"+date_server_converted_brt,
        "device_name": event["device_name"],
        "client_id": event["client_id"],
        "latitude": Decimal(str(event["latitude"])),
        "longitude": Decimal(str(event["longitude"])),
        "tempC": Decimal(str(event["tempC"])),
        "tempF": Decimal(str(event["tempF"])),
        "altitude": Decimal(str(event["altitude"])),
        "speed": Decimal(str(event["speed"])),
        "date_server": date_server_converted_brt,
        "timestamp_server": timestamp_server_string
    })
    
def lambda_handler(event, context):

    put_data(event)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data Inserted!')
    }
    



