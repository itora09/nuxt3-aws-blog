import dynamoose from 'dynamoose'

export default defineNitroPlugin(() => {
  if (process.env.NODE_ENV === 'development') {
    dynamoose.aws.ddb.local()
  } else {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      credentials: {
        accessKeyId: 'AKID',
        secretAccessKey: 'SECRET',
      },
      region: 'us-east-1',
    })

    // Set DynamoDB instance to the Dynamoose DDB instance
    dynamoose.aws.ddb.set(ddb)
  }
})
