import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { generateToken } from "@ms-commerce/common";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({ binary: { version: "4.2.6" } });
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  process.env.JWT_KEY = "asdfg";
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  function signin(): Promise<string[]>;
}

global.signin = async () => {
  const payload = {
    id: new mongoose.Types.ObjectId("635d013ae716eacb0e92d422").toHexString(),
    email: "test@test.com",
  };

  const token = generateToken(payload.id, payload.email);

  return [`access_token=${token}`];
};
