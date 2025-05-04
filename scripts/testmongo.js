const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" }); // 👈 Important!

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri, {
  tls: true,
  serverApi: {
    version: "1",
  },
});

async function test() {
  try {
    await client.connect();
    const db = client.db("jobboard"); // update if needed
    const collections = await db.collections();
    console.log("✅ Connected. Collections:", collections.map(c => c.collectionName));
    await client.close();
  } catch (e) {
    console.error("❌ MongoDB connection failed:\n", e);
  }
}

test();
