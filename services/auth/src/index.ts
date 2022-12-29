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
      console.log('Listening on port 3000!');
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
