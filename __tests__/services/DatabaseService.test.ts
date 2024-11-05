import mongoose from "mongoose";
import { DatabaseService } from "@/services/DatabaseService";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    get readyState() {
      return 0;
    },
  },
}));

describe("DatabaseService", () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";
    databaseService = new DatabaseService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setReadyState = (state: number) => {
    Object.defineProperty(mongoose.connection, "readyState", {
      value: state,
      writable: true,
    });
  };

  describe("connect", () => {
    it("should connect to MongoDB if not connected", async () => {
      setReadyState(0);
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(null);

      await databaseService.connect();

      expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI, {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      expect(databaseService.getConnectionStatus()).toBe(true);
    });

    it("should not reconnect if already connected", async () => {
      databaseService["isConnected"] = true;

      await databaseService.connect();

      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(databaseService.getConnectionStatus()).toBe(true);
    });

    it("should handle connection errors", async () => {
      setReadyState(0);
      (mongoose.connect as jest.Mock).mockRejectedValueOnce(
        new Error("Connection failed")
      );

      await expect(databaseService.connect()).rejects.toThrow(
        "Failed to connect to database"
      );
      expect(databaseService.getConnectionStatus()).toBe(false);
    });
  });

  describe("disconnect", () => {
    it("should disconnect from MongoDB if connected", async () => {
      setReadyState(1);
      (mongoose.disconnect as jest.Mock).mockResolvedValueOnce(null);

      await databaseService.disconnect();

      expect(mongoose.disconnect).toHaveBeenCalled();
      expect(databaseService.getConnectionStatus()).toBe(false);
    });

    it("should not attempt to disconnect if already disconnected", async () => {
      setReadyState(0);

      await databaseService.disconnect();

      expect(mongoose.disconnect).not.toHaveBeenCalled();
    });

    it("should handle disconnection errors", async () => {
      setReadyState(1);
      databaseService["isConnected"] = true;
      (mongoose.disconnect as jest.Mock).mockRejectedValueOnce(
        new Error("Disconnection failed")
      );

      await expect(databaseService.disconnect()).rejects.toThrow(
        "Failed to disconnect from database"
      );
      expect(databaseService.getConnectionStatus()).toBe(true);
    });
  });

  describe("getConnectionStatus", () => {
    it("should return the current connection status", () => {
      expect(databaseService.getConnectionStatus()).toBe(false);
      databaseService["isConnected"] = true;
      expect(databaseService.getConnectionStatus()).toBe(true);
    });
  });
});
