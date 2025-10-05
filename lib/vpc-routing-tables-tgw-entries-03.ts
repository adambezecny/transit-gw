import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {subnetId} from "aws-cdk-lib/aws-ec2/lib/util";

export class VpcRoutingTablesTgwEntriesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC lookups
        const routeTableIdSubnet1 = cdk.Fn.importValue('exportSubnet1RTId');
        const routeTableIdSubnet2 = cdk.Fn.importValue('exportSubnet2RTId');
        const routeTableIdSubnet3 = cdk.Fn.importValue('exportSubnet3RTId');
        const routeTableIdSubnet4 = cdk.Fn.importValue('exportSubnet4RTId');
        const routeTableIdSubnet5 = cdk.Fn.importValue('exportSubnet5RTId');
        const routeTableIdSubnet6 = cdk.Fn.importValue('exportSubnet6RTId');

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
         [routeTableIdSubnet1, routeTableIdSubnet2].forEach((subnetRTId, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc1ToTransitGW_${index}`, {
                 routeTableId: subnetRTId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

         // route table entries for VPC2 subnets -> transit gateway
         [routeTableIdSubnet3, routeTableIdSubnet4].forEach((subnetRTId, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc2ToTransitGW_${index}`, {
                 routeTableId: subnetRTId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

        // route table entries for VPC3 subnets -> transit gateway
        [routeTableIdSubnet5, routeTableIdSubnet6].forEach((subnetRTId, index) => {
             new ec2.CfnRoute(this, `RouteFromVpc3ToTransitGW_${index}`, {
                 routeTableId: subnetRTId,
                 destinationCidrBlock: '10.0.0.0/8',
                 transitGatewayId,
             });
         });

    } // end of stack constructor
} // end of stack class
