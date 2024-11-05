import { POST } from "@/app/api/register/route";
import { container } from "@infrastructure/di/container";
import { IUserService } from "@/services/interfaces/IUserService";
import { UserRole } from "@/domain/models/User";

jest.mock("@infrastructure/di/container", () => ({
  container: {
    get: jest.fn(),
  },
}));

const validRoles: UserRole[] = ["user"];

describe("Register API Route", () => {
  let mockUserService: jest.Mocked<IUserService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserService = {
      signup: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;

    (container.get as jest.Mock).mockReturnValue(mockUserService);
  });

  it("should successfully register a new user", async () => {
    const mockDate = new Date();
    const mockUser = {
      id: "test-id",
      email: "test@example.com",
      roles: validRoles,
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    mockUserService.signup.mockResolvedValue(mockUser);

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(201);
    expect(responseData).toEqual({
      ...mockUser,
      createdAt: mockDate.toISOString(),
      updatedAt: mockDate.toISOString(),
    });
    expect(mockUserService.signup).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should return 400 for invalid input data", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "invalid-email",
        password: "123",
      }),
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toBeTruthy();
    expect(mockUserService.signup).not.toHaveBeenCalled();
  });

  it("should return 400 when user already exists", async () => {
    mockUserService.signup.mockRejectedValue(new Error("User already exists"));

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "existing@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toEqual({ message: "User already exists" });
  });

  it("should return 500 for unexpected errors", async () => {
    mockUserService.signup.mockRejectedValue(new Error("Database error"));

    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData).toEqual({ message: "Internal server error" });
  });

  it("should return 400 for missing required fields", async () => {
    const request = new Request("http://localhost:3000/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
      }),
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toBeTruthy();
    expect(mockUserService.signup).not.toHaveBeenCalled();
  });
});
