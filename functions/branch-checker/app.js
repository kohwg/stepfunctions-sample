const AWS = require('aws-sdk');
const table_name = process.env.tablename;
const ddb = new AWS.DynamoDB.DocumentClient();

function getitem(params) {
    return ddb.get(params).promise()
            .then(res => res.Item)
            .catch(err => err)
};

exports.lambdaHandler = async (event, context) => {
    console.log(event)
    const branch_code = event["branch_code"]
    
    const params = {
        TableName: table_name,
        Key: {
            'branchCode': branch_code
        }
    };

    console.log(" ###### Get data data DDB, input data:", params)
        try {
            const items = await getitem(params);
            if(items["Available"]){
                const result = {
                    input_sfn: event,
                    branch_validation_result: "success"            
                }
                return result;
            } else {
                return { 'branch_validation_result': 'Failed, branch is not available' }
            } 
        } catch (err) {
            return {'branch_validation_result': 'Failed, input avaialable branch_code' }
        }
};
