import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcRoutingTablesTgwEntriesStack extends cdk.Stack {
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
        const transitGatewayId = cdk.Fn.importValue('exportTransitGatewayId');


        // with propagation in place automatically routes might be good enough with no need to add custom routes
        //
        // custom routes:
        //const transitGWRouteTableAttach1Route1 = new ec2.CfnTransitGatewayRoute(this, `transitGWRouteTableAttach1Route1`, {
        //    destinationCidrBlock: '10.2.0.0/16',
        //    transitGatewayRouteTableId: transitGWRouteTableAttach2.ref,
        //    transitGatewayAttachmentId: tgwAttachment2.ref,
        //});
        //cdk.Tags.of(transitGWRouteTableAttach1Route1).add('Name', 'tgw-route-for-attach-02-to-spoke-01');

        //
        // creates routes in the second run, once tgw is ready. adding explicit dependency did not help :(
        // => must be in separate stack called after vpc-stack-01 and transit-gw-stack-02!
        //

         // route table entries for VPC1 subnets -> transit gateway
         [privateSubnet1, privateSubnet2].forEach((subnet, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc1ToTransitGW_${index}`, {
                 routeTableId: subnet.routeTable.routeTableId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

         // route table entries for VPC2 subnets -> transit gateway
         [privateSubnet3, privateSubnet4].forEach((subnet, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc2ToTransitGW_${index}`, {
                 routeTableId: subnet.routeTable.routeTableId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

        // route table entries for VPC3 subnets -> transit gateway
        [privateSubnet5, privateSubnet6].forEach((subnet, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc3ToTransitGW_${index}`, {
                 routeTableId: subnet.routeTable.routeTableId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

    } // end of stack constructor
} // end of stack class
