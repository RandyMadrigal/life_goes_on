import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("✅  MongoDB connected");
  } catch (error) {
    console.error("❌  MongoDB connection failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️   MongoDB disconnected — attempting to reconnect...");
});

mongoose.connection.on("error", (err: Error) => {
  console.error("❌  MongoDB error:", err.message);
});
