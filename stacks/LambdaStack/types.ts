import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';

export interface LambdaStackProps extends cdk.StackProps {
  s3ListenerRoleArn: string;
  serviceBucketArn: string;
  defaultLambdaRoleArn: string;
  s3TriggerSnsTopicArn: string;
}

/**
 *
 * function: setupS3ListenerLambda
 *
 */
export interface SetupS3ListenerLambdaInput {
  role: iam.IRole;
  serviceBucket: s3.IBucket;
  s3TriggerSnsTopic: sns.ITopic;
}

export type SetupS3ListenerLambdaOutput = lambda.Function;

/**
 *
 * function: setupLambda1
 *
 */
export interface SetupLambda1Input {
  role: iam.IRole;
  s3TriggerSnsTopic: sns.ITopic;
}

export type SetupLambda1Output = lambda.Function;

/**
 *
 * function: setupLambda2
 *
 */
export interface SetupLambda2Input {
  role: iam.IRole;
  s3TriggerSnsTopic: sns.ITopic;
}

export type SetupLambda2Output = lambda.Function;
