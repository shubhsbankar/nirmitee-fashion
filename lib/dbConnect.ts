/*import mongoose from "mongoose";


const DB_URL  = process.env.DATABASE_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn : null,
    promise : null
  };
}


const connectDB = async () => {

  if (cached.conn)
    return cached.conn;

  if (!cached.promise){

    cached.promise = mongoose.connect(DB_URL, {
      dbName: "NirmiteeFashion",
      bufferCommands: false
    })
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
*/

import mongoose, { Mongoose } from "mongoose";

const DB_URL = process.env.DB_URI;

if (!DB_URL) {
  throw new Error("Please define the DATABASE_URI environment variable");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend NodeJS.Global type
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async (): Promise<Mongoose> => {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(DB_URL, {
      dbName: "NirmiteeFashion",
      bufferCommands: false,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
};

export default connectDB;

