import mongoose from "mongoose";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nayka");
  const events = await mongoose.connection.collection("events").find({}).toArray();
  console.log(JSON.stringify(events, null, 2));
  process.exit(0);
}
run();
