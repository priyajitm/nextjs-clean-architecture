import { UserRole } from "@/domain/models/User";

export class UserEntity {
  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly roles: UserRole[]
  ) {
    this.validateEmail(email);
    this.validatePassword(password);
  }

  private validateEmail(email: string) {
    if (!/^[^@]+@[^@]+$/.test(email)) {
      throw new Error("Invalid email");
    }
  }

  private validatePassword(password: string) {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

  toObject() {
    return {
      email: this.email,
      password: this.password,
      roles: this.roles,
    };
  }
}
