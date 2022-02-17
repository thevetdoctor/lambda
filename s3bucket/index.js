'use strict'
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event) => {

    const { name } = event.Records[0].s3.bucket;
    const { key } = event.Records[0].s3.object;

    const getParams = {
        Bucket: name,
        Key: key
    };
         
    let responseBody;
    let statusCode;

    try {
        const getData = await s3.getObject(getParams).promise();
        const dataString = getData.Body.toString();
        const dataJSON = JSON.parse(dataString);
        console.log(dataString, dataJSON);

        await Promise.all(dataJSON.map(async (user) => {
            const { id, firstname, lastname } = user;
            const putParams = {
                Item: {
                    id,
                    firstname,
                    lastname
                }, 
                TableName: "usersupload"
            };
            await client.put(putParams).promise();

            statusCode = 201;
            responseBody = 'User upload successful';
        }));

    } catch (error) {
        statusCode = 404;
        responseBody = 'User upload failed';
    }

    const response = {
        "statusCode": statusCode,
        "headers" : {
            'testheader': 'test'
        },
        "body": responseBody,
        "isBase64Encoded": false
    };

    return response;
}