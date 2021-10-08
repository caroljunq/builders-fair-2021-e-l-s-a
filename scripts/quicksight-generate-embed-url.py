# This code generates Quicksgiht Embeded URL to embed in the application

import json
import boto3
from botocore.exceptions import ClientError
import os

def lambda_handler(event, context):

    awsAccountId = context.invoked_function_arn.split(':')[4]
    
    dashboardIdList = re.sub(' ','',os.environ['DashboardId'])
    dashboardNameList = os.environ['DashboardName']
    dashboardRegion = os.environ['DashboardRegion']
    
    quickSight = boto3.client('quicksight', region_name=dashboardRegion);

    try:
        response = quickSight.get_dashboard_embed_url(
             AwsAccountId = awsAccountId,
             Namespace = 'default',
             DashboardId = dashboardIdList,
             AdditionalDashboardIds=dashboardIdList,
             IdentityType = 'ANONYMOUS',
             SessionLifetimeInMinutes = 120,
             UndoRedoDisabled = True,
             ResetDisabled = True
         )
         
        url = response['EmbedUrl']
            
        return {
            'statusCode': 200,
            'headers': {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps(response),
            'isBase64Encoded':  bool('false')
        }
        
    except ClientError as e:
        print(e)
        return "Error generating embeddedURL: " + str(e)