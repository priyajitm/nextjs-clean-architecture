import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { DatabaseService } from "@/services/DatabaseService";
import { TYPES } from "@/infrastructure/di/types";
import { Container } from "inversify";
import { User } from "@/domain/models/User";

jest.mock("@/domain/models/User", () => ({
  User: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

const UserMock = jest.mocked(User);
UserMock.findOne = jest.fn();

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let databaseService: jest.Mocked<DatabaseService>;
  let container: Container;

  beforeEach(() => {
    jest.clearAllMocks();

    databaseService = {
      connect: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DatabaseService>;

    container = new Container();
    container
      .bind<DatabaseService>(TYPES.DatabaseService)
      .toConstantValue(databaseService);
    container.bind<UserRepository>(UserRepository).toSelf();

    userRepository = container.get<UserRepository>(UserRepository);
  });

  describe("findByEmail", () => {
    it("should find a user by email successfully", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail("test@example.com");

      expect(databaseService.connect).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail(
        "nonexistent@example.com"
      );

      expect(databaseService.connect).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
      expect(result).toBeNull();
    });

    it("should throw an error when database operation fails", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error occurred")
      );

      await expect(
        userRepository.findByEmail("test@example.com")
      ).rejects.toThrow("Database error occurred");

      expect(databaseService.connect).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      const userData = { email: "new@example.com" };
      const mockUser = { id: "1", ...userData };

      const saveMock = jest.fn().mockResolvedValue(mockUser);
      UserMock.mockImplementation(() => ({
        save: saveMock,
      }));

      const result = await userRepository.create(userData);

      expect(databaseService.connect).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should throw an error when user creation fails", async () => {
      const userData = { email: "new@example.com" };

      const saveMock = jest
        .fn()
        .mockRejectedValue(new Error("Failed to create user"));
      UserMock.mockImplementation(() => ({
        save: saveMock,
      }));

      await expect(userRepository.create(userData)).rejects.toThrow(
        "Failed to create user"
      );

      expect(databaseService.connect).toHaveBeenCalled();
    });
  });
});
