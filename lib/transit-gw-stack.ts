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

     // Transit gateway
     const transitGateway = new ec2.CfnTransitGateway(this, 'TransitGateway', {});
     cdk.Tags.of(transitGateway).add('Name', 'tw-gw-01');

     // Attach VPC1 to the Transit Gateway
     const tgwAttachment1 = new ec2.CfnTransitGatewayAttachment(this, 'TGWAttachment1', {
         transitGatewayId: transitGateway.ref,
         vpcId: vpc1.vpcId,
         subnetIds: [privateSubnet1.subnetId, privateSubnet2.subnetId],
     });
     cdk.Tags.of(tgwAttachment1).add('Name', 'tw-gw-attach-vpc-spoke-01');

     // Attach VPC2 to the Transit Gateway
     const tgwAttachment2 = new ec2.CfnTransitGatewayAttachment(this, 'TGWAttachment2', {
         transitGatewayId: transitGateway.ref,
         vpcId: vpc2.vpcId,
         subnetIds: [privateSubnet3.subnetId, privateSubnet4.subnetId],
     });
     cdk.Tags.of(tgwAttachment2).add('Name', 'tw-gw-attach-vpc-spoke-02');

    // Attach VPC3 to the Transit Gateway
    const tgwAttachment3 = new ec2.CfnTransitGatewayAttachment(this, 'TGWAttachment3', {
        transitGatewayId: transitGateway.ref,
        vpcId: vpc3.vpcId,
        subnetIds: [privateSubnet5.subnetId, privateSubnet6.subnetId],
    });
    cdk.Tags.of(tgwAttachment3).add('Name', 'tw-gw-attach-vpc-hub-01');
  }
}
