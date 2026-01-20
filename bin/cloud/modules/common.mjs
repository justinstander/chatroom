import { inspect } from 'node:util';

export const sendCommand = (client) => async (command) => {
  try {
    const response = await client.send(command);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const callerReference = () => Date.now().toString();

export const commandLine = () => {
  const args = process.argv.slice(3);
  const command = process.argv[2];

  return { args, command };
};

export const print = (array) => array && console.log(
  array.join?.('\n') ??
  ((typeof array === 'string') ? array : inspect(array, false, null, true))
);
