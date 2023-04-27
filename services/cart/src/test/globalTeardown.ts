import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { prisma } from '../prisma';

export = async function globalTeardown() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const replset: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;

  await prisma.$disconnect();

  await replset.stop({ doCleanup: true, force: true });
};
