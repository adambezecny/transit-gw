import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as aws_apigateway from "aws-cdk-lib/aws-apigateway";
import {
    InterfaceVpcEndpoint,
    InterfaceVpcEndpointAwsService,
} from 'aws-cdk-lib/aws-ec2';

export class SimpleLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC lookups
        const availabilityZones=['eu-central-1a','eu-central-1b'];
        const vpc1 = ec2.Vpc.fromVpcAttributes(this, 'vpc1', {availabilityZones, vpcCidrBlock: "10.1.0.0/16", vpcId: cdk.Fn.importValue('exportVpc1Id')});
        const vpc2 = ec2.Vpc.fromVpcAttributes(this, 'vpc2', {availabilityZones, vpcCidrBlock: "10.2.0.0/16", vpcId: cdk.Fn.importValue('exportVpc2Id')});
        const vpc3 = ec2.Vpc.fromVpcAttributes(this, 'vpc3', {availabilityZones, vpcCidrBlock: "10.3.0.0/16", vpcId: cdk.Fn.importValue('exportVpc3Id')});
        const privateSubnet1 = ec2.Subnet.fromSubnetAttributes(this, 'subnet1', {subnetId: cdk.Fn.importValue('exportSubnet1Id')});
        const privateSubnet2 = ec2.Subnet.fromSubnetAttributes(this, 'subnet2', {subnetId: cdk.Fn.importValue('exportSubnet2Id')});
        const privateSubnet3 = ec2.Subnet.fromSubnetAttributes(this, 'subnet3', {subnetId: cdk.Fn.importValue('exportSubnet3Id')});
        const privateSubnet4 = ec2.Subnet.fromSubnetAttributes(this, 'subnet4', {subnetId: cdk.Fn.importValue('exportSubnet4Id')});
        const privateSubnet5 = ec2.Subnet.fromSubnetAttributes(this, 'subnet5', {subnetId: cdk.Fn.importValue('exportSubnet5Id')});
        const privateSubnet6 = ec2.Subnet.fromSubnetAttributes(this, 'subnet6', {subnetId: cdk.Fn.importValue('exportSubnet6Id')});

        const simpleLambda = new cdk.aws_lambda.Function(this, 'SimpleLambda', {
            runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
            handler: 'index.handler',
            code: cdk.aws_lambda.Code.fromInline(`
            exports.handler = async function(event) {
                return { statusCode: 200, body: "Hello from Lambda 2!!!! foo header is: " + event.headers['foo'] };
            };
          `),
        });

        const apiEndpoint = new InterfaceVpcEndpoint(this, "apiEndpoint", {
            service: InterfaceVpcEndpointAwsService.APIGATEWAY,
            vpc: vpc2, // IMPORTANT: we intend to call api below via this VPCE from VPC1 utilizing TGW!
            privateDnsEnabled: false,
            subnets: {
                subnets: [privateSubnet3, privateSubnet4],
            },
            //securityGroups: [securityGroup443],
        });
        //apiEndpoint.addToPolicy(policy);
        cdk.Tags.of(apiEndpoint).add("Name", "apiEndpoint");


        const api = new aws_apigateway.RestApi(this, "ApiGW-test-api", {
            defaultMethodOptions: {
                authorizationType: aws_apigateway.AuthorizationType.NONE,
            },
            restApiName: "privateapigwsample-test-api-tgw-stack",
            deployOptions: {
                stageName: "api",
                //accessLogDestination: new aws_apigateway.LogGroupLogDestination(this.accessLogGroup),
                //accessLogFormat: generateAccessLogFormat(),
                loggingLevel: aws_apigateway.MethodLoggingLevel.ERROR,
                metricsEnabled: true,
                tracingEnabled: true,

                methodOptions: {
                    "/*/*": {},
                },
            },
            endpointTypes: [aws_apigateway.EndpointType.PRIVATE],
            policy: new cdk.aws_iam.PolicyDocument({
                statements: [
                    new cdk.aws_iam.PolicyStatement({
                        actions: ["execute-api:Invoke"],
                        resources: ["*"],
                        effect: cdk.aws_iam.Effect.DENY,
                        principals: [new cdk.aws_iam.AnyPrincipal()],
                        conditions: {
                            StringNotEquals: {
                                "aws:sourceVpce": [
                                    apiEndpoint.vpcEndpointId,
                                    "vpce-0af3c594c60e5bca8" // IMPORTANT: privateapigwsample-generic-vpce-outbound
                                ]
                            },
                        },
                    }),
                    new cdk.aws_iam.PolicyStatement({
                        actions: ["execute-api:Invoke"],
                        resources: [`*`],
                        effect: cdk.aws_iam.Effect.ALLOW,
                        principals: [new cdk.aws_iam.AnyPrincipal()],
                    }),
                ],
            }),
        });
        const AR_test =  api.root.addResource("test");
        AR_test.addMethod("GET", new aws_apigateway.LambdaIntegration(simpleLambda), {});

    } // end of stack constructor
} // end of stack class
