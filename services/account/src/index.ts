import { createLightship } from 'lightship';
import { app } from './app';
import { DatabaseUrlUndefinedError, JWTUndefinedError } from './errors';

const start = async () => {
  const lightship = await createLightship();

  if (!process.env['JWT_KEY']) {
    throw new JWTUndefinedError();
  }

  if (!process.env['DATABASE_URL']) {
    throw new DatabaseUrlUndefinedError();
  }

  const server = app
    .listen(3000, () => {
      console.info('Listening on port 3000!');
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
