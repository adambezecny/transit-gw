import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class TransitGwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const vpc1 = new ec2.Vpc(this, 'CustomVPCSpoke1', {
          ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
          vpcName: "vpc-spoke-01",
          maxAzs: 2,
      });

      const vpc2 = new ec2.Vpc(this, 'CustomVPCSpoke2', {
          ipAddresses: ec2.IpAddresses.cidr('10.2.0.0/16'),
          vpcName: "vpc-spoke-02",
          maxAzs: 2,
      });

      const vpc3 = new ec2.Vpc(this, 'CustomVPCHub1', {
          ipAddresses: ec2.IpAddresses.cidr('10.3.0.0/16'),
          vpcName: "vpc-hub-01",
          maxAzs: 2,
      });

      const privateSubnet1 = new ec2.Subnet(this, 'PrivateSubnet1', {
          vpcId: vpc1.vpcId,
          cidrBlock: '10.1.1.0/24',
          availabilityZone: vpc1.availabilityZones[0],
      });
      cdk.Tags.of(privateSubnet1).add('Name', 'spoke-01-priv-subnet-01');

      const privateSubnet2 = new ec2.Subnet(this, 'PrivateSubnet2', {
          vpcId: vpc2.vpcId,
          cidrBlock: '10.2.1.0/24',
          availabilityZone: vpc1.availabilityZones[0],
      });
      cdk.Tags.of(privateSubnet2).add('Name', 'spoke-02-priv-subnet-01');
  }
}
