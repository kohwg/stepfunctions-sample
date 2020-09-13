const AWS = require('aws-sdk');
const table_name = process.env.tablename;
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function putitems(params) {
    return dynamodb.putItem(params).promise()
            .then(res => res.Item)
            .catch(err => err)
}

exports.lambdaHandler = async (event, context) => {
    var date = new Date();
    const params = {
        TableName: table_name,
        Item: {
            "ClassId": {S: event.input_sfn.class_name},
            'timestamp': {S: date.toISOString()}
        }
    };
    console.log(" ###### Put data to DDB, input data:", params)
    
    try {
        const items = await putitems(params);
        const result = {
            input_sfn: event['input_sfn'],
            updata_class_info_result: "success"
        }
        return result;
    } catch (err) {
        return {'updata_class_info_result': 'Failed, cannot input data due to', err }
    }
 
};
