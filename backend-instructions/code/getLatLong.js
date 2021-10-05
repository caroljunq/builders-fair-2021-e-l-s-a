const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

var params = {
    Limit: 1,
    TableName: process.env.TABLE_NAME
};
var listLatLong= []

const getAllTemp = async () => {
    listLatLong= []
    const scanResult = await dynamo.scan(params).promise();
    for (var i = 0; i < 1; i++) {
       listLatLong.push(scanResult["Items"][i]["latitude"])
       listLatLong.push(scanResult["Items"][i]["longitude"])
    }

    return scanResult;
}


exports.handler = async (event) => {
    const data = await getAllTemp();
    var datajson = JSON.stringify(data)
    
    const response = {
        statusCode: 200,
        body:listLatLong,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
    return response;
};