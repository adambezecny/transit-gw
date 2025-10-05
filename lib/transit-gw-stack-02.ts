import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class TransitGwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC lookups
    const vpc1 = ec2.Vpc.fromLookup(this, 'vpc1', {vpcId: cdk.Fn.importValue('exportVpc1Id')});
    const vpc2 = ec2.Vpc.fromLookup(this, 'vpc2', {vpcId: cdk.Fn.importValue('exportVpc2Id')});
    const vpc3 = ec2.Vpc.fromLookup(this, 'vpc3', {vpcId: cdk.Fn.importValue('exportVpc3Id')});
    const privateSubnet1 = ec2.Subnet.fromSubnetId(this, 'subnet1', cdk.Fn.importValue('exportSubnet1Id'));
    const privateSubnet2 = ec2.Subnet.fromSubnetId(this, 'subnet2', cdk.Fn.importValue('exportSubnet2Id'));
    const privateSubnet3 = ec2.Subnet.fromSubnetId(this, 'subnet3', cdk.Fn.importValue('exportSubnet3Id'));
    const privateSubnet4 = ec2.Subnet.fromSubnetId(this, 'subnet4', cdk.Fn.importValue('exportSubnet4Id'));
    const privateSubnet5 = ec2.Subnet.fromSubnetId(this, 'subnet5', cdk.Fn.importValue('exportSubnet5Id'));
    const privateSubnet6 = ec2.Subnet.fromSubnetId(this, 'subnet6', cdk.Fn.importValue('exportSubnet6Id'));

     // Transit gateway
     const transitGateway = new ec2.CfnTransitGateway(this, 'TransitGateway', {
         defaultRouteTableAssociation: 'disable',
         defaultRouteTablePropagation: 'disable',
     });
     cdk.Tags.of(transitGateway).add('Name', 'tw-gw-01');

      // create custom route tables for attachments that will be used instead of the default transit gateway route table
      const transitGWRouteTableAttach1 = new ec2.CfnTransitGatewayRouteTable(this, 'transitGWRouteTableForAttach1', {
          transitGatewayId: transitGateway.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach1).add('Name', 'tgw-route-table-attach-01');

      const transitGWRouteTableAttach2 = new ec2.CfnTransitGatewayRouteTable(this, 'transitGWRouteTableForAttach2', {
          transitGatewayId: transitGateway.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach2).add('Name', 'tgw-route-table-attach-02');

      const transitGWRouteTableAttach3 = new ec2.CfnTransitGatewayRouteTable(this, 'transitGWRouteTableForAttach3', {
          transitGatewayId: transitGateway.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach3).add('Name', 'tgw-route-table-attach-03');


     // Attach VPC1 to the Transit Gateway
     const tgwAttachment1 = new ec2.CfnTransitGatewayAttachment(this, 'TGWAttachment1', {
         transitGatewayId: transitGateway.ref,
         vpcId: vpc1.vpcId,
         subnetIds: [privateSubnet1.subnetId, privateSubnet2.subnetId], //connect subnets in all AZs you want to attach via transit gateway!
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

       // tgw attachment route tables associations
       const transitGWRouteTableAttach1Assoc = new ec2.CfnTransitGatewayRouteTableAssociation(this, 'transitGWRouteTableAttach1Assoc', {
           transitGatewayAttachmentId: tgwAttachment1.ref,
           transitGatewayRouteTableId: transitGWRouteTableAttach1.ref,
       });
       cdk.Tags.of(transitGWRouteTableAttach1Assoc).add('Name', 'tgw-route-table-attach-01-assoc');

      const transitGWRouteTableAttach2Assoc = new ec2.CfnTransitGatewayRouteTableAssociation(this, 'transitGWRouteTableAttach2Assoc', {
          transitGatewayAttachmentId: tgwAttachment2.ref,
          transitGatewayRouteTableId: transitGWRouteTableAttach2.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach2Assoc).add('Name', 'tgw-route-table-attach-02-assoc');

      const transitGWRouteTableAttach3Assoc = new ec2.CfnTransitGatewayRouteTableAssociation(this, 'transitGWRouteTableAttach3Assoc', {
          transitGatewayAttachmentId: tgwAttachment3.ref,
          transitGatewayRouteTableId: transitGWRouteTableAttach3.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach3Assoc).add('Name', 'tgw-route-table-attach-03-assoc');

      // tgw attachment route tables propagations
      const transitGWRouteTableAttach1Propagation = new ec2.CfnTransitGatewayRouteTablePropagation(this, 'transitGWRouteTableAttach1Propagation', {
          transitGatewayAttachmentId: tgwAttachment1.ref,
          transitGatewayRouteTableId: transitGWRouteTableAttach1.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach1Propagation).add('Name', 'tgw-route-table-attach-01-propagation');

      const transitGWRouteTableAttach2Propagation = new ec2.CfnTransitGatewayRouteTablePropagation(this, 'transitGWRouteTableAttach2Propagation', {
          transitGatewayAttachmentId: tgwAttachment2.ref,
          transitGatewayRouteTableId: transitGWRouteTableAttach2.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach2Propagation).add('Name', 'tgw-route-table-attach-02-propagation');

      const transitGWRouteTableAttach3Propagation = new ec2.CfnTransitGatewayRouteTablePropagation(this, 'transitGWRouteTableAttach3Propagation', {
          transitGatewayAttachmentId: tgwAttachment3.ref,
          transitGatewayRouteTableId: transitGWRouteTableAttach3.ref,
      });
      cdk.Tags.of(transitGWRouteTableAttach3Propagation).add('Name', 'tgw-route-table-attach-03-propagation');

      new cdk.CfnOutput(this, 'TransitGatewayIdExport', {
          value: transitGateway.ref,
          exportName: 'exportTransitGatewayId',
      });

  } // end of stack constructor
} // end of stack class
