import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

import { Stacks } from '../../constants';

export class RoleStack extends cdk.Stack {
  public readonly s3ListenerRole: iam.Role;
  public readonly defaultLambdaRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.s3ListenerRole = this.setupS3ListenerRole();
    this.defaultLambdaRole = this.setupDefaultLambdaRole();
  }

  private setupS3ListenerRole() {
    const role = new iam.Role(this, `${Stacks.RoleStack}-s3-listener-role`, {
      // Declare that Lambda service can assume this role
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        )
      ]
    });
    return role;
  }

  private setupDefaultLambdaRole() {
    const role = new iam.Role(this, `${Stacks.RoleStack}-lambda-default-role`, {
      // Declare that Lambda service can assume this role
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        )
      ]
    });
    return role;
  }
}
