import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables.");
}

let isConnected = false; // Track if MongoDB is connected

export const databaseConnection = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection ✅.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);

    isConnected = !!db.connections[0].readyState;
    console.log("Connected to MongoDB ✅");

    // Optional: Handle disconnection events
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected ❌");
      isConnected = false;
    });
  } catch (error: any) {
    console.error("MongoDB connection error ❌:", error.message);
    process.exit(1);
  }
};
