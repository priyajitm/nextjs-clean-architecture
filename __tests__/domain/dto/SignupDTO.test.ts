import { SignupDTO } from "@/domain/dto/SignupDTO";

describe("SignupDTO", () => {
  it("should validate with a valid email and password", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };

    expect(() => SignupDTO.parse(validData)).not.toThrow();
  });

  it("should throw an error if email is invalid", () => {
    const invalidEmailData = {
      email: "invalid-email",
      password: "password123",
    };

    expect(() => SignupDTO.parse(invalidEmailData)).toThrow("Invalid email");
  });

  it("should throw an error if password is less than 6 characters", () => {
    const shortPasswordData = {
      email: "test@example.com",
      password: "123",
    };

    expect(() => SignupDTO.parse(shortPasswordData)).toThrow(
      "String must contain at least 6 character(s)"
    );
  });

  it("should throw an error if email is missing", () => {
    const missingEmailData = {
      password: "password123",
    };

    expect(() => SignupDTO.parse(missingEmailData)).toThrow("Required");
  });

  it("should throw an error if password is missing", () => {
    const missingPasswordData = {
      email: "test@example.com",
    };

    expect(() => SignupDTO.parse(missingPasswordData)).toThrow("Required");
  });
});