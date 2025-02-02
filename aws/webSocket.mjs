#!/usr/bin/env node

import {
  ApiGatewayV2Client,
  CreateApiCommand,
  DeleteApiCommand,
  CreateStageCommand,
  DeleteStageCommand
} from "@aws-sdk/client-apigatewayv2";
import { sendCommand } from "./common.mjs";

console.log(process.argv);

if (!process.argv[2]) {
  throw new Error("Command is required");
};

const client = new ApiGatewayV2Client();
const command = process.argv[2];

/**
 * Create an API Gateway Web Socket API
 * 
 * @param {array} args arguments
 * @param {string} args[0] Web Socket Name
 * @returns API response from command
 */
const createApi = async ([Name]) => {
  const ProtocolType = "WEBSOCKET";
  const RouteSelectionExpression = "request.body.action";

  const command = new CreateApiCommand({
    Name,
    ProtocolType,
    RouteSelectionExpression
  });

  return await sendCommand(client, command);
};

/**
 * Delete an API Gateway Web Socket API
 * 
 * @param {array} args
 * @param {string} args[0] Web Socket API ID
 * @returns API response from command
 */
const deleteApi = async ([ApiId]) => {
  const command = new DeleteApiCommand({
    ApiId
  });

  return await sendCommand(client, command);
};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const createStage = async ([ApiId, StageName]) => {
  const command = new CreateStageCommand({ApiId, StageName});

  return await sendCommand(client, command);
};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const deleteStage = async ([ApiId, StageName]) => {
  const command = new DeleteStageCommand({ApiId, StageName});

  return await sendCommand(client, command);
};

const args = process.argv.slice(3);

switch (command) {
  case "createApi":
    createApi(args);
    break;
  case "deleteApi":
    deleteApi(args);
    break;
  case "createStage":
    createStage(args);
    break;
  case "deleteStage":
    deleteStage(args);
    break;
  default:
    throw new Error("Invalid Command");
};
