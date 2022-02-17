'use strict';

const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-2" });

exports.handler = async(event, context) => {

    const db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
    const client = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
        
    let responseBody;
    let statusCode;

    const { id, firstname, lastname } = JSON.parse(event.body);
    
    const params = {
            Item: {
                id,
                firstname,
                lastname
            }, 
            TableName: "users"
    };
    
    try {
        const data = await client.put(params).promise();
        statusCode = 201;
        responseBody = JSON.stringify(data);
    } catch (error) {
        statusCode = 404;
        responseBody = 'Unable to create user data';
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
};