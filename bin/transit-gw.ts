#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack-01';
import { TransitGwStack } from '../lib/transit-gw-stack-02';
import { VpcRoutingTablesTgwEntriesStack } from '../lib/vpc-routing-tables-tgw-entries-03';
import { SimpleLambdaStack } from '../lib/simple-lambda-04';

const app = new cdk.App();
const env = { account: '287378523389', region: 'eu-central-1' };
const env2 = { account: '144242257718', region: 'eu-central-1' };

new VpcStack(app, 'VpcStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
   env: env2,

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

new TransitGwStack(app, 'TransitGwStack', {env: env2});
new VpcRoutingTablesTgwEntriesStack(app, 'VpcRoutingTablesTgwEntriesStack', {env: env2});
new SimpleLambdaStack(app, 'SimpleLambdaStack', {env: env2});