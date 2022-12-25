import { createLightship } from 'lightship';

import { app } from './app';

const start = async () => {
  const lightship = await createLightship();

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined');
  }

  const server = app
    .listen(3000, () => {
      console.log('Listening on port 3000!');
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
