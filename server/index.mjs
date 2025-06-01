import { broadcastCount, broadcastMessage, sendToClient } from './modules/api.mjs';
import { deleteConnectionId, getConnectionIds, putConnectionId } from './modules/db.mjs';
import { publishConnectionNotification } from './modules/notifications.mjs';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];

/**
 * The error is only visible in our logs,
 * sends plain 422 to client.
 * 
 * @param {*} error 
 * @returns 
 */
const handleError = (error) => {
  console.error(error);
  return {
    statusCode: 422
  };
};

/**
 * AWS Lambda handler
 * 
 * @param {*} event 
 * @returns 
 */
export const handler = async (event) => {
  console.log(event);

  const {
    body,
    headers,
    requestContext
  } = event;
  const { routeKey, connectionId, stage, domainName } = requestContext;

  try {
    switch (routeKey) {
      case '$connect':
        console.log('Connect');
        const Origin = headers?.Origin ?? '(no Origin)';

        if (!allowedOrigins.includes(Origin)) return handleError('CORS');

        await putConnectionId(connectionId);
        await publishConnectionNotification(`Connected: ${connectionId}\n${Origin}`);
        await broadcastCount({ requestContext });
        break;
      case '$disconnect':
        console.log('Disconnect');
        await deleteConnectionId(connectionId);
        await publishConnectionNotification(`Disconnect: ${connectionId}`);
        await broadcastCount({ requestContext });
        break;
      case 'clientOpen':
        console.log('Client Open');
        const connectionIds = await getConnectionIds();
        const connectionIdsLength = connectionIds.length;
        await sendToClient({
          connectionId, Data: JSON.stringify({
            body: `Users: ${connectionIdsLength}`,
            type: 'count'
          }), stage, domainName, deleteOnError: false
        });
        break;
      case '$default':
        await broadcastMessage({ body, requestContext });
        break;
      default:
        return handleError(new Error(`Unsupported route: ${routeKey}`));
    }
  } catch (error) {
    return handleError(error);
  }

  return {
    statusCode: 200
  };
};
