import { createLightship } from 'lightship';
import { DatabaseUrlUndefinedError } from './errors';

import { app } from './app';

const start = async () => {
  const lightship = await createLightship();

  if (!process.env['DATABASE_URL']) {
    throw new DatabaseUrlUndefinedError();
  }

  const server = app
    .listen(3001, () => {
      console.log('Listening on port 3001!');
      lightship.signalReady();
    })
    .on('error', () => {
      lightship
        .shutdown()
        .then(() => {
          console.log('Shutting down');
        })
        .catch((error) => {
          console.log('Lightship: Error shutting down...');
          console.log(error);
        });
    });

  lightship.registerShutdownHandler(() => {
    server.close();
  });
};

void start();
