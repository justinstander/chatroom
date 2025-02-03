/**
 * Send command to client, then log and return response
 * 
 * @param {*} client AWS SDK Client
 * @param {*} command AWS SDK Command
 * @returns response from command
 */
export const sendCommand = (client) => async (command) => {
  const response = await client.send(command);

  console.log(response);

  return response;
};
