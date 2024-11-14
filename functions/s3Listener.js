const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const client = new SNSClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  for (const record of event.Records) {
    const key = record.s3.object.key;
    if (key.startsWith('folder1/')) {
      console.log(`Received file in folder1: ${key}`);
      await client.send(
        new PublishCommand({
          Message: JSON.stringify({ filename: key }),
          TopicArn: process.env.S3_TRIGGER_SNS_TOPIC,
          MessageAttributes: {
            handler: {
              DataType: 'String',
              StringValue: 'lambda1'
            }
          }
        })
      );
    } else if (key.startsWith('folder2/')) {
      console.log(`Received file in folder2: ${key}`);
      await client.env(
        new PublishCommand({
          Message: JSON.stringify({ filename: key }),
          TopicArn: process.env.S3_TRIGGER_SNS_TOPIC,
          MessageAttributes: {
            handler: {
              DataType: 'String',
              StringValue: 'lambda2'
            }
          }
        })
      );
    } else {
      console.log('File not in folder1 or folder2');
    }
  }
};
