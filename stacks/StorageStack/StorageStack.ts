import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { Stacks } from '../../constants';

export class StorageStack extends cdk.Stack {
  public readonly serviceBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.serviceBucket = this.setupServiceBucket();
  }

  private setupServiceBucket(): s3.Bucket {
    const bucket = new s3.Bucket(this, `${Stacks.StorageStack}-service-bucket`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    return bucket;
  }
}
