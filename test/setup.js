import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import Role from '../src/models/Role.js';

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const roles = ['reader', 'creator', 'admin'];
  await Promise.all(roles.map(role => Role.create({ name: role })));
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

export default app;
