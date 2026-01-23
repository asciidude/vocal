import mongoose from "mongoose";
import { MONGO_URI } from '$env/static/private';
import { dev } from '$app/environment';

export const mongoConnection = {
  connection_code: 0
};

export const connect = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is undefined!");
  }

  if (mongoConnection.connection_code === 1) {
    console.log('Already connected.');
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.connection_code =
      mongoose.connections[0].readyState;

    if (mongoConnection.connection_code === 1) return;

    await mongoose.disconnect();
  }

  await mongoose.connect(encodeURI(MONGO_URI), {
    dbName: dev ? 'development' : 'production'
  });

  mongoConnection.connection_code = 1;
  console.log('MongoDB connected.');
};

export const disconnect = async () => {
  if (dev) return;
  if (mongoConnection.connection_code === 0) return;

  await mongoose.disconnect();
  mongoConnection.connection_code = 0;
  console.log('MongoDB disconnected.');
};