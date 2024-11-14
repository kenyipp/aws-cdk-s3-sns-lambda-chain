import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

import { Stacks } from '../../constants';

export class SnsStack extends cdk.Stack {
  public readonly s3TriggerSnsTopic: sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.s3TriggerSnsTopic = this.setupS3TriggerSnsTopic();
  }

  private setupS3TriggerSnsTopic(): sns.Topic {
    const topic = new sns.Topic(this, `${Stacks.SnsStack}-s3-trigger-topic`, {
      displayName: 'S3 Trigger Topic'
    });
    return topic;
  }
}
