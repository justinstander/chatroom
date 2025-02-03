#!/usr/bin/env node

import {
  ApiGatewayV2Client,
  CreateApiCommand,
  DeleteApiCommand,
  CreateStageCommand,
  DeleteStageCommand,
  CreateRouteCommand,
  DeleteRouteCommand,
  CreateIntegrationCommand,
  DeleteIntegrationCommand,
  CreateDeploymentCommand
} from "@aws-sdk/client-apigatewayv2";
import { sendCommand } from "./common.mjs";
import { ProtocolType, RouteSelectionExpression } from "./constants.mjs";

const client = new ApiGatewayV2Client();
const send = sendCommand(client);

/**
 * Create an API Gateway Web Socket API
 * 
 * @param {array} args arguments
 * @param {string} args[0] Web Socket Name
 * @returns API response from command
 */
const createApi = async (Name) => await send(
  new CreateApiCommand({
    Name,
    ProtocolType,
    RouteSelectionExpression
  })
);

/**
 * Delete an API Gateway Web Socket API
 * 
 * @param {array} args
 * @param {string} args[0] Web Socket API ID
 * @returns API response from command
 */
const deleteApi = async (ApiId) => await send(
  new DeleteApiCommand({
    ApiId
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const createStage = async (ApiId, StageName) => await send(
  new CreateStageCommand({
    ApiId,
    StageName
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const deleteStage = async (ApiId, StageName) => await send(
  new DeleteStageCommand({
    ApiId,
    StageName
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const createRoute = async (ApiId, RouteKey, Target) => await send(
  new CreateRouteCommand({
    ApiId,
    RouteKey,
    Target
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const deleteRoute = async (ApiId, RouteId) => await send(
  new DeleteRouteCommand({
    ApiId,
    RouteId
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const createIntegration = async (ApiId, IntegrationType) => await send(
  new CreateIntegrationCommand({
    ApiId,
    IntegrationType
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const deleteIntergration = async (ApiId, IntegrationId) => await send(
  new DeleteIntegrationCommand({
    ApiId,
    IntegrationId
  })
);

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const createDeployment = async (ApiId, StageName) => await send(
  new CreateDeploymentCommand({
    ApiId,
    StageName
  })
);

const buildWebSocket = async (Name) => {
  const { ApiId } = await createApi(Name);
  const { StageName } = await createStage(ApiId, "stage");
  const { IntegrationId } = await createIntegration(ApiId, "MOCK");
  
  await createRoute(ApiId, "chat", `integrations/${IntegrationId}`);
  await createDeployment(ApiId, StageName);
}

console.log(process.argv);

const args = process.argv.slice(3);
const command = process.argv[2];

switch (command) {
  case "createApi":
    createApi(...args);
    break;
  case "deleteApi":
    deleteApi(...args);
    break;
  case "createStage":
    createStage(...args);
    break;
  case "deleteStage":
    deleteStage(...args);
    break;
  case "createRoute":
    createRoute(...args);
    break;
  case "deleteRoute":
    deleteRoute(...args);
    break;
  case "createIntegration":
    createIntegration(...args);
    break;
  case "deleteIntegration":
    deleteIntergration(...args);
    break;
  case "buildWebSocket":
    buildWebSocket(...args);
    break;
  default:
    throw new Error("Invalid Command");
};
