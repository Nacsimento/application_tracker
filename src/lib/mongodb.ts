// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Type-safe connection options
const options: MongoClientOptions = {
  // Connection pooling and timeouts
  maxPoolSize: 50,
  minPoolSize: 10,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,

  // TLS/SSL configuration
  tls: true,
  ...(process.env.NODE_ENV === "development" && {
    tlsAllowInvalidCertificates: false, // Set to true only for local dev if needed
  }),

  // Stable API version
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },

  // Retryable operations
  retryWrites: true,
  retryReads: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  // across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    console.log("Created new MongoDB connection");
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new connection each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log("Creating production MongoDB connection");
}

// Export a module-scoped MongoClient promise
export default clientPromise;