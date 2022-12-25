import { app } from './app';

const start = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined');
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001!');
  });
};

start();
