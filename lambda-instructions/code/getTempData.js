const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

var params = {
    Limit: 7,
    TableName: process.env.TABLE_NAME
};
var listtemp = []

const getAllTemp = async () => {
    const scanResult = await dynamo.scan(params).promise();
    listtemp = []

    for (var i = 0; i < 7; i++) {
       listtemp.push(scanResult["Items"][i]["tempC"])
    console.log(scanResult["Items"][i]["tempC"]);
    }

   // console.log(scanResult["Items"][0]["tempC"])
    //console.log(scanResult.data.Items.tempC);

    return scanResult;
}


exports.handler = async (event) => {
    const data = await getAllTemp();
    var datajson = JSON.stringify(data)
    
    const response = {
        statusCode: 200,
        body:listtemp,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
    return response;
};