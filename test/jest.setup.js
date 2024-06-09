import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('My Test Suite', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.disconnect();
      await mongoServer.stop();
    }
  });

  test('My Test Case', async () => {
    console.log('test')
  });
});
