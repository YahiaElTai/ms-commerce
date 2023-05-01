import { createServer as createPrometheusMetricsServer } from '@promster/server';
import { createLightship } from 'lightship';
import { DatabaseUrlUndefinedError } from './errors';
import { app } from './app';

const start = async () => {
  const lightship = await createLightship();

  const prometheusMetricsServer = await createPrometheusMetricsServer({
    detectKubernetes: false,
    port: 7788,
  });

  if (!process.env['DATABASE_URL']) {
    throw new DatabaseUrlUndefinedError();
  }

  const server = app
    .listen(3002, () => {
      console.info('Listening on port 3002!');
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
    prometheusMetricsServer.close();

    server.close();
  });
};

void start();
