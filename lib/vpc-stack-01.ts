import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc1 = new ec2.Vpc(this, 'CustomVPCSpoke1', {
            ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
            vpcName: "vpc-spoke-01",
            maxAzs: 2,
            subnetConfiguration: [], // disable default subnets (e.g. public!)
        });

        const vpc2 = new ec2.Vpc(this, 'CustomVPCSpoke2', {
            ipAddresses: ec2.IpAddresses.cidr('10.2.0.0/16'),
            vpcName: "vpc-spoke-02",
            maxAzs: 2,
            subnetConfiguration: [], // disable default subnets (e.g. public!)
        });

        const vpc3 = new ec2.Vpc(this, 'CustomVPCHub1', {
            ipAddresses: ec2.IpAddresses.cidr('10.3.0.0/16'),
            vpcName: "vpc-hub-01",
            maxAzs: 2,
            subnetConfiguration: [], // disable default subnets (e.g. public!)
        });

        // vpc1 subnets
        const privateSubnet1 = new ec2.Subnet(this, 'PrivateSubnet1', {
            vpcId: vpc1.vpcId,
            cidrBlock: '10.1.1.0/24',
            availabilityZone: vpc1.availabilityZones[0],
        });
        cdk.Tags.of(privateSubnet1).add('Name', 'spoke-01-priv-subnet-01');
        const privateSubnet2 = new ec2.Subnet(this, 'PrivateSubnet2', {
            vpcId: vpc1.vpcId,
            cidrBlock: '10.1.2.0/24',
            availabilityZone: vpc1.availabilityZones[1],
        });
        cdk.Tags.of(privateSubnet2).add('Name', 'spoke-01-priv-subnet-02');

        // vpc2 subnets
        const privateSubnet3 = new ec2.Subnet(this, 'PrivateSubnet3', {
            vpcId: vpc2.vpcId,
            cidrBlock: '10.2.1.0/24',
            availabilityZone: vpc2.availabilityZones[0],
        });
        cdk.Tags.of(privateSubnet3).add('Name', 'spoke-02-priv-subnet-01');
        const privateSubnet4 = new ec2.Subnet(this, 'PrivateSubnet4', {
            vpcId: vpc2.vpcId,
            cidrBlock: '10.2.2.0/24',
            availabilityZone: vpc2.availabilityZones[1],
        });
        cdk.Tags.of(privateSubnet4).add('Name', 'spoke-02-priv-subnet-02');

        // vpc3 subnets
        const privateSubnet5 = new ec2.Subnet(this, 'PrivateSubnet5', {
            vpcId: vpc3.vpcId,
            cidrBlock: '10.3.1.0/24',
            availabilityZone: vpc3.availabilityZones[0],
        });
        cdk.Tags.of(privateSubnet5).add('Name', 'hub-01-priv-subnet-01');
        const privateSubnet6 = new ec2.Subnet(this, 'PrivateSubnet6', {
            vpcId: vpc3.vpcId,
            cidrBlock: '10.3.2.0/24',
            availabilityZone: vpc3.availabilityZones[1],
        });
        cdk.Tags.of(privateSubnet6).add('Name', 'hub-01-priv-subnet-02');

        new cdk.CfnOutput(this, 'vpc1-id', {
            value: vpc1.vpcId,
            exportName: "exportVpc1Id",
        });

        new cdk.CfnOutput(this, 'vpc2-id', {
            value: vpc2.vpcId,
            exportName: "exportVpc2Id",
        });

        new cdk.CfnOutput(this, 'vpc3-id', {
            value: vpc3.vpcId,
            exportName: "exportVpc3Id",
        });

        new cdk.CfnOutput(this, 'subnet1-id', {
            value: privateSubnet1.subnetId,
            exportName: "exportSubnet1Id",
        });

        new cdk.CfnOutput(this, 'subnet2-id', {
            value: privateSubnet2.subnetId,
            exportName: "exportSubnet2Id",
        });

        new cdk.CfnOutput(this, 'subnet3-id', {
            value: privateSubnet3.subnetId,
            exportName: "exportSubnet3Id",
        });

        new cdk.CfnOutput(this, 'subnet4-id', {
            value: privateSubnet4.subnetId,
            exportName: "exportSubnet4Id",
        });

        new cdk.CfnOutput(this, 'subnet5-id', {
            value: privateSubnet5.subnetId,
            exportName: "exportSubnet5Id",
        });

        new cdk.CfnOutput(this, 'subnet6-id', {
            value: privateSubnet6.subnetId,
            exportName: "exportSubnet6Id",
        });

        new cdk.CfnOutput(this, 'subnet1-rt-id', {
            value: privateSubnet1.routeTable.routeTableId,
            exportName: "exportSubnet1RTId",
        });

        new cdk.CfnOutput(this, 'subnet2-rt-id', {
            value: privateSubnet2.routeTable.routeTableId,
            exportName: "exportSubnet2RTId",
        });

        new cdk.CfnOutput(this, 'subnet3-rt-id', {
            value: privateSubnet3.routeTable.routeTableId,
            exportName: "exportSubnet3RTId",
        });

        new cdk.CfnOutput(this, 'subnet4-rt-id', {
            value: privateSubnet4.routeTable.routeTableId,
            exportName: "exportSubnet4RTId",
        });

        new cdk.CfnOutput(this, 'subnet5-rt-id', {
            value: privateSubnet5.routeTable.routeTableId,
            exportName: "exportSubnet5RTId",
        });

        new cdk.CfnOutput(this, 'subnet6-rt-id', {
            value: privateSubnet6.routeTable.routeTableId,
            exportName: "exportSubnet6RTId",
        });

    } // end of stack constructor
} // end of stack class
