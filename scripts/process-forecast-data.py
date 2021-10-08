# This code gets iot data from dynamodb and transform to use on Forecast

import pandas as pd
import boto3

def lambda_handler(event, context):
    bucket_name = 'bucket-name-datalake'
    key = 'processed-data-forecast-ml/update/'
    file_name = 'DadosReais.csv'
    
    # Retrieve data from DynamoDB
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('your-table-name')
    response = table.scan()
    response = pd.DataFrame(response['Items'])
    
    # Process data
    filtered_data = response[["client_id","timestamp_server","tempC"]]
    filtered_data = filtered_data.rename(columns={
        'client_id': 'item_id',
        'timestamp_server': 'timestamp',
        'tempC': 'target_value'
    })
    filtered_data = filtered_data.sort_values(by='timestamp')
    filtered_data.to_csv('/tmp/' + file_name, index=False)
    
    # Save the dataset to the data lake
    try:
        boto3.Session().resource('s3').Bucket(bucket_name).upload_file('/tmp/' + file_name, 'processed-data-forecast-ml/update/{}'.format(file_name))
        print('Upload to S3 successfully completed')
    except:
        print('Error on uploading file to S3')
    
    # Import Amazon Forecast dataset
    