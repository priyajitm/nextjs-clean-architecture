import { UserEntity } from "@/domain/entities/UserEntity";
import { UserRole } from "@/domain/models/User";

describe("UserEntity", () => {
  const validEmail = "test@example.com";
  const validPassword = "password123";
  const validRoles: UserRole[] = ["user", "admin"];

  describe("constructor", () => {
    it("should create a UserEntity instance with valid email, password, and roles", () => {
      const user = new UserEntity(validEmail, validPassword, validRoles);
      expect(user).toBeInstanceOf(UserEntity);
    });

    it("should throw an error if email is invalid", () => {
      const invalidEmail = "invalid-email";
      expect(
        () => new UserEntity(invalidEmail, validPassword, validRoles)
      ).toThrow("Invalid email");
    });

    it("should throw an error if password is less than 6 characters", () => {
      const shortPassword = "12345";
      expect(
        () => new UserEntity(validEmail, shortPassword, validRoles)
      ).toThrow("Password must be at least 6 characters");
    });
  });

  describe("toObject", () => {
    it("should return the correct object representation of the user", () => {
      const user = new UserEntity(validEmail, validPassword, validRoles);
      expect(user.toObject()).toEqual({
        email: validEmail,
        password: validPassword,
        roles: validRoles,
      });
    });
  });
});
