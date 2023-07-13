/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const AWS = require('aws-sdk')
const dotenv = require('dotenv')
require('aws-sdk/lib/maintenance_mode_message').suppress = true

/* 引数を取得 */
const deployOnlyFlag = process.argv[2] === 'true'
const stackName = process.argv[3]
if (!stackName && !deployOnlyFlag)
  throw new Error('スタック名を引数で入力してください。')

/* env存在チェック、無ければ作成 */
if (!fs.existsSync('./.env')) {
  fs.writeFileSync('.env', fs.readFileSync('.env-sample'))
}

const region = 'ap-northeast-1'
const cloudFormation = new AWS.CloudFormation({
  region,
})
const s3 = new AWS.S3({
  region,
})
const lambda = new AWS.Lambda({
  region,
})

/**
 * cloud formationのスタックを作成する
 * ※スタックの作成が終了するまで待機
 * @param {*} params
 * @returns 実行結果
 */
const createStack = function (params) {
  console.log('スタックの作成中：' + params.StackName)

  return new Promise((resolve, reject) => {
    // スタックを作成＆実行
    cloudFormation.createStack(params, function (err, data) {
      if (err) return reject(err)

      // スタックの作成が終了するまで待機
      cloudFormation.waitFor(
        'stackCreateComplete',
        { StackName: data.StackId },
        function (err, data) {
          if (err) return reject(err)
          console.log('スタックの作成完了')
          resolve(data)
        }
      )
    })
  })
}

/**
 * cloud formationの実行結果を取得する
 * @param {*} params
 * @returns 実行結果
 */
const describeStacks = function (params) {
  return new Promise((resolve, reject) => {
    cloudFormation.describeStacks(params, function (err, data) {
      if (err) return reject(err)
      resolve(data.Stacks[0].Outputs)
    })
  })
}

/**
 * 引数の情報をもとにS3へファイルをアップする
 * @param {*} params
 * @returns
 */
const s3PutObject = function (params) {
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

/**
 * 以下の流れでAWSインフラ環境を構築する
 * 1. AWS lambdaに使うためのzipファイルを格納するS3を作成
 * 2. S3へzipファイルをアップ
 * 3. サーバーレスアプリの構築
 */
const init = async () => {
  const paramsS3 = {
    StackName: `${stackName}-s3`,
    TemplateBody: fs.readFileSync(
      './cloudFormation/cloudFormation_s3.yml',
      'utf-8'
    ),
  }

  await createStack(paramsS3)
  const s3DescribeResult = await describeStacks({
    StackName: paramsS3.StackName,
  })
  const s3LambdaOutput = s3DescribeResult[0]
  const s3StaticOutput = s3DescribeResult[1]
  const s3Key = 'my-lambda-function.zip'

  const lambdaZip = fs.readFileSync(`./.output/${s3Key}`)
  await s3PutObject({
    Bucket: s3LambdaOutput.OutputValue,
    Key: s3Key,
    Body: lambdaZip,
  })

  const params = {
    StackName: `${stackName}`,
    TemplateBody: fs.readFileSync(
      './cloudFormation/cloudFormation.yml',
      'utf-8'
    ),
    Parameters: [
      {
        ParameterKey: 'LambdaS3Bucket',
        ParameterValue: s3LambdaOutput.OutputValue,
      },
      {
        ParameterKey: 'LambdaS3Key',
        ParameterValue: s3Key,
      },
      {
        ParameterKey: 'LambdaFunctionNam',
        ParameterValue: `${stackName}-lambda`,
      },
      {
        ParameterKey: 'StaticS3Bucket',
        ParameterValue: s3StaticOutput.OutputValue,
      },
    ],
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
  }

  await createStack(params)

  // envの情報を更新する
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  envConfig.LAMBDA_S3_BUCKET = s3LambdaOutput.OutputValue
  envConfig.STATIC_S3_BUCKET = s3StaticOutput.OutputValue
  envConfig.LAMBDA_FUNCTIN_NAME = `${stackName}-lambda`

  const envContent = Object.keys(envConfig)
    .map((key) => `${key}=${envConfig[key]}`)
    .join('\n')
  fs.writeFileSync('.env', envContent)
}

if (deployOnlyFlag) {
  console.log('デプロイ中')
  dotenv.config()
  const s3Key = 'my-lambda-function.zip'
  const lambdaZip = fs.readFileSync(`./.output/${s3Key}`)
  s3PutObject({
    Bucket: process.env.LAMBDA_S3_BUCKET,
    Key: s3Key,
    Body: lambdaZip,
  })
    .then(() => {
      const params = {
        FunctionName: process.env.LAMBDA_FUNCTIN_NAME,
        S3Bucket: process.env.LAMBDA_S3_BUCKET,
        S3Key: s3Key,
      }

      lambda.updateFunctionCode(params, function (err) {
        if (err) console.log(err, err.stack)
        else console.log('デプロイ終了')
      })
    })
    .catch((err) => {
      console.log('デプロイエラー')
      console.log(err)
    })
} else {
  init()
}
