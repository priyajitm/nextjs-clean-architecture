import { inject, injectable } from "inversify";
import { IUserService } from "@/services/interfaces/IUserService";
import { SignupDTO } from "@domain/dto/SignupDTO";
import { hash } from "@node-rs/argon2";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { UserDTO } from "@/domain/dto/UserDTO";
import { IUserResponse } from "@/domain/interfaces/IUserResponse";
import { TYPES } from "@/infrastructure/di/types";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async findByEmail(email: string): Promise<IUserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return UserDTO.parse(user);
  }

  async signup(data: SignupDTO): Promise<IUserResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      roles: ["user"],
    });

    return UserDTO.parse(user);
  }
}
