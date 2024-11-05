import { SignupDTO } from "@domain/dto/SignupDTO";
import { IUserService } from "@/services/interfaces/IUserService";
import { container } from "@infrastructure/di/container";
import { TYPES } from "@infrastructure/di/types";

export async function POST(req: Request) {
  const parsedBody = SignupDTO.safeParse(await req.json());
  if (!parsedBody.success) {
    return new Response(JSON.stringify(parsedBody.error), { status: 400 });
  }

  try {
    const userService = container.get<IUserService>(TYPES.UserService);
    const newUser = await userService.signup(parsedBody.data);
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
