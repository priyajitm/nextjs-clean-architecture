import { IRole } from "@domain/models/Role";

export interface IRoleService {
  findByName(name: string): Promise<IRole | null>;
  // Other CRUD operations can be defined here.
}
