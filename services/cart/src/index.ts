import { createLightship } from 'lightship';

import { app } from './app';

const start = async () => {
  const lightship = await createLightship();

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined');
  }

  const server = app
    .listen(3001, () => {
      console.log('Listening on port 3001!');
      lightship.signalReady();
    })
    .on('error', () => {
      lightship.shutdown();
    });

  lightship.registerShutdownHandler(() => {
    server.close();
  });
};

start();
