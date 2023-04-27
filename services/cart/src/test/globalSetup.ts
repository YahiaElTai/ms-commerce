import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { prisma } from '../prisma';

export = async function globalSetup() {
  const replset = await MongoMemoryReplSet.create({
    instanceOpts: [
      {
        port: 27019,
      },
    ],
    replSet: { count: 3, storageEngine: 'wiredTiger' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (global as any).__MONGOINSTANCE = replset;

  const uri = replset.getUri('cart');

  process.env['DATABASE_URL'] = uri;

  await prisma.$disconnect();
};
