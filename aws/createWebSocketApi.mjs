#!/usr/bin/env node

import { ApiGatewayV2Client, CreateApiCommand } from "@aws-sdk/client-apigatewayv2";

console.log(process.argv);

const Name = process.argv[2]; 
const ProtocolType = "WEBSOCKET";
const RouteSelectionExpression = "request.body.action";

const client = new ApiGatewayV2Client();
const input = {
  Name,
  ProtocolType,
  RouteSelectionExpression
};
const command = new CreateApiCommand(input);
const response = await client.send(command);

console.log(JSON.stringify(response,null,4));

