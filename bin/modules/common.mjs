export const sendCommand = (client) => async (command) => {
  try {
    const response = await client.send(command);

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const commandLine = () => {
  const args = process.argv.slice(3);
  const command = process.argv[2];

  return { args, command };
}
