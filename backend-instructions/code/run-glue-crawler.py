import boto3
client = boto3.client('glue')



def lambda_handler(event, context):
    
    glueCrawlerName = "raw-data-data-lake"
    
    response = client.start_crawler(Name=glueCrawlerName)
    
    # TODO implement
    return response
