import { UserRole } from "@domain/models/User";

export interface IUserResponse {
  id: string;
  email: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}
