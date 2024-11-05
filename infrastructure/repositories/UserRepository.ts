import { injectable, inject } from "inversify";
import { IUser, User } from "@/domain/models/User";
import { DatabaseService } from "@/services/DatabaseService";
import { TYPES } from "../di/types";

@injectable()
export class UserRepository {
  constructor(
    @inject(TYPES.DatabaseService)
    private readonly databaseService: DatabaseService
  ) {}

  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      await this.databaseService.connect();
      return User.findOne({ email });
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Database error occurred");
    }
  }

  public async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      await this.databaseService.connect();
      const user = new User(userData);
      return user.save();
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Failed to create user");
    }
  }
}
