# This code run Glue Crawler

import boto3
client = boto3.client('glue')


def lambda_handler(event, context):
    
    glueCrawlerName = "your-crawler-name"
    
    response = client.start_crawler(Name=glueCrawlerName)
    
    return response
