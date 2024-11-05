import { UserService } from "@/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { SignupDTO } from "@/domain/dto/SignupDTO";
import { hash } from "@node-rs/argon2";
import { UserRole } from "@/domain/models/User";

jest.mock("@node-rs/argon2", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

describe("UserService", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(userRepository);
  });

  describe("findByEmail", () => {
    it("should return null when user is not found", async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail("test@example.com");

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });

    it("should return UserDTO when user is found", async () => {
      const mockUser = {
        id: "test-id",
        email: "test@example.com",
        roles: ["user"] as UserRole[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        password: "hashed_password",
      });

      const result = await userService.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });
  });

  describe("signup", () => {
    const signupData: SignupDTO = {
      email: "test@example.com",
      password: "password123",
    };

    it("should throw error if user already exists", async () => {
      userRepository.findByEmail.mockResolvedValue({
        email: signupData.email,
        password: "hashed_password",
        roles: ["user"] as UserRole[],
      });

      await expect(userService.signup(signupData)).rejects.toThrow(
        "User already exists"
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(signupData.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it("should create new user successfully", async () => {
      const mockCreatedUser = {
        id: "test-id",
        email: signupData.email,
        roles: ["user"] as UserRole[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        ...mockCreatedUser,
        password: "hashed_password",
      });

      const result = await userService.signup(signupData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(signupData.email);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: signupData.email,
        password: "hashed_password",
        roles: ["user"],
      });
      expect(result).toEqual(mockCreatedUser);
      expect(hash).toHaveBeenCalledWith(signupData.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
    });
  });
});
