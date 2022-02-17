'use strict'
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

exports.handler = async(event, context) => {

    const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    const client = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
    
    let responseBody;
    let statusCode;

    console.log(event);
    const { id } = event.pathParameters;

    const params = {
            Key: {
                id
            }, 
            TableName: 'users'
    };
    
    try {
        const data = await client.get(params).promise();
        statusCode = 200;
        responseBody = data.Item;
    } catch (error) {
        statusCode = 404;
        responseBody = 'Unable to get user data';
    }

    const response = {
        'statusCode': statusCode,
        'headers' : {
            'testheader': 'test'
        },
        'body': JSON.stringify(responseBody),
        'isBase64Encoded': false
    };

    return response;
}