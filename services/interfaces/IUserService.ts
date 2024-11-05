import { IUserResponse } from "@/domain/interfaces/IUserResponse";
import { SignupDTO } from "@domain/dto/SignupDTO";

export interface IUserService {
  findByEmail(email: string): Promise<IUserResponse | null>;
  signup(data: SignupDTO): Promise<IUserResponse>;
}
