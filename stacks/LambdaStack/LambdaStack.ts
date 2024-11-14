import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import path from 'path';

import { Stacks } from '../../constants';
import {
  LambdaStackProps,
  SetupLambda1Input,
  SetupLambda1Output,
  SetupLambda2Input,
  SetupLambda2Output,
  SetupS3ListenerLambdaInput,
  SetupS3ListenerLambdaOutput
} from './types';

export class LambdaStack extends cdk.Stack {
  public readonly s3ListenerLambda: lambda.Function;
  public readonly lambda1: lambda.Function;
  public readonly lambda2: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    const {
      s3ListenerRoleArn,
      serviceBucketArn,
      defaultLambdaRoleArn,
      s3TriggerSnsTopicArn
    } = props;

    const s3ListenerRole = iam.Role.fromRoleArn(
      this,
      `${Stacks.LambdaStack}-s3-listener-role`,
      s3ListenerRoleArn
    );
    const serviceBucket = s3.Bucket.fromBucketArn(
      this,
      `${Stacks.LambdaStack}-service-bucket`,
      serviceBucketArn
    );
    const defaultLambdaRole = iam.Role.fromRoleArn(
      this,
      `${Stacks.LambdaStack}-default-lambda-role`,
      defaultLambdaRoleArn
    );
    const s3TriggerSnsTopic = sns.Topic.fromTopicArn(
      this,
      `${Stacks.LambdaStack}-sns-topic`,
      s3TriggerSnsTopicArn
    );

    this.s3ListenerLambda = this.setupS3ListenerLambda({
      role: s3ListenerRole,
      serviceBucket,
      s3TriggerSnsTopic
    });
    this.lambda1 = this.setupLambda1({
      role: defaultLambdaRole,
      s3TriggerSnsTopic
    });
    this.lambda2 = this.setupLambda2({
      role: defaultLambdaRole,
      s3TriggerSnsTopic
    });
  }

  private setupS3ListenerLambda({
    role,
    serviceBucket,
    s3TriggerSnsTopic
  }: SetupS3ListenerLambdaInput): SetupS3ListenerLambdaOutput {
    const lambdaFunction = new lambda.Function(
      this,
      `${Stacks.LambdaStack}-s3-listener`,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 's3Listener.handler',
        functionName: `${Stacks.LambdaStack}-s3-listener`,
        code: lambda.Code.fromAsset(path.join(__dirname, '../../functions')),
        environment: {
          S3_TRIGGER_SNS_TOPIC: s3TriggerSnsTopic.topicArn
        },
        role
      }
    );

    role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [s3TriggerSnsTopic.topicArn]
      })
    );

    serviceBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(lambdaFunction)
    );

    return lambdaFunction;
  }

  private setupLambda1({
    role,
    s3TriggerSnsTopic
  }: SetupLambda1Input): SetupLambda1Output {
    const lambdaFunction = new lambda.Function(
      this,
      `${Stacks.LambdaStack}-lambda-1`,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'lambda1.handler',
        functionName: `${Stacks.LambdaStack}-lambda-1`,
        code: lambda.Code.fromAsset(path.join(__dirname, '../../functions')),
        role,
        environment: {
          S3_TRIGGER_SNS_TOPIC: s3TriggerSnsTopic.topicArn
        }
      }
    );

    s3TriggerSnsTopic.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaFunction, {
        filterPolicy: {
          handler: sns.SubscriptionFilter.stringFilter({
            allowlist: ['lambda1']
          })
        }
      })
    );

    return lambdaFunction;
  }

  private setupLambda2({
    role,
    s3TriggerSnsTopic
  }: SetupLambda2Input): SetupLambda2Output {
    const lambdaFunction = new lambda.Function(
      this,
      `${Stacks.LambdaStack}-lambda-2`,
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'lambda2.handler',
        functionName: `${Stacks.LambdaStack}-lambda-2`,
        code: lambda.Code.fromAsset(path.join(__dirname, '../../functions')),
        role,
        environment: {
          S3_TRIGGER_SNS_TOPIC: s3TriggerSnsTopic.topicArn
        }
      }
    );

    s3TriggerSnsTopic.addSubscription(
      new snsSubscriptions.LambdaSubscription(lambdaFunction, {
        filterPolicy: {
          handler: sns.SubscriptionFilter.stringFilter({
            allowlist: ['lambda2']
          })
        }
      })
    );

    return lambdaFunction;
  }
}
