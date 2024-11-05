import { UserDTO } from "@/domain/dto/UserDTO";

describe("UserDTO", () => {
  it("should validate a user object with correct fields", () => {
    const validData = {
      id: "user123",
      email: "user@example.com",
      roles: ["user", "admin"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(validData)).not.toThrow();
  });

  it("should throw an error if id is missing", () => {
    const data = {
      email: "user@example.com",
      roles: ["user"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(data)).toThrow("Required");
  });

  it("should throw an error if email format is invalid", () => {
    const data = {
      id: "user123",
      email: "invalid-email",
      roles: ["user"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(data)).toThrow("Invalid email");
  });

  it("should throw an error if roles contain an invalid value", () => {
    const data = {
      id: "user123",
      email: "user@example.com",
      roles: ["guest"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(data)).toThrow("Invalid enum value");
  });

  it("should throw an error if roles is not an array", () => {
    const data = {
      id: "user123",
      email: "user@example.com",
      roles: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(data)).toThrow(
      "Expected array, received string"
    );
  });

  it("should throw an error if createdAt is not a date", () => {
    const data = {
      id: "user123",
      email: "user@example.com",
      roles: ["user"],
      createdAt: "not-a-date",
      updatedAt: new Date(),
    };

    expect(() => UserDTO.parse(data)).toThrow("Expected date, received string");
  });

  it("should throw an error if updatedAt is not a date", () => {
    const data = {
      id: "user123",
      email: "user@example.com",
      roles: ["user"],
      createdAt: new Date(),
      updatedAt: "not-a-date",
    };

    expect(() => UserDTO.parse(data)).toThrow("Expected date, received string");
  });
});
