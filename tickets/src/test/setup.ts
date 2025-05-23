import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongodb: any;

beforeAll(async () => {
  process.env.JWT_KEY = "thisismysecretkey";
  mongodb = await MongoMemoryServer.create();
  const mongoUri = mongodb.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (!collections) {
    throw new Error("Collections could not be retrieved.");
  }
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongodb.stop();
  await mongoose.connection.close();
});
