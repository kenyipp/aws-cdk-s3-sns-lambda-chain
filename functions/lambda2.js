exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);
    console.log(`Received message: ${JSON.stringify(message, null, 2)}`);
  }
};
