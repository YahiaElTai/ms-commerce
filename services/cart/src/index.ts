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
      console.info('Listening on port 3001!');
      lightship.signalReady();
    })
    .on('error', () => {
      lightship
        .shutdown()
        .then(() => {
          console.warn('Shutting down');
        })
        .catch((error) => {
          console.error('Lightship: Error shutting down...');
          console.error(error);
        });
    });

  lightship.registerShutdownHandler(() => {
    server.close();
  });
};

void start();
