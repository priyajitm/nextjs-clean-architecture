import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export class DatabaseService {
  private readonly dbUri: string;
  private static readonly instance: DatabaseService;
  private isConnected: boolean = false;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    this.dbUri = process.env.MONGODB_URI;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        console.log("Using existing database connection");
        return;
      }

      if (mongoose.connection.readyState === 0) {
        const options = {
          autoIndex: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };

        await mongoose.connect(this.dbUri, options);
        this.isConnected = true;
        console.log("Connected to MongoDB");
      }
    } catch (error) {
      this.isConnected = false;
      console.error("Database connection error:", error);
      throw new Error("Failed to connect to database");
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log("Disconnected from MongoDB");
      }
    } catch (error) {
      console.error("Database disconnection error:", error);
      throw new Error("Failed to disconnect from database");
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
