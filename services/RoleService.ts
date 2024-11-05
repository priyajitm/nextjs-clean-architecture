import { injectable } from "inversify";
import { IRole, Role } from "@domain/models/Role";
import { IRoleService } from "@/services/interfaces/IRoleService";

@injectable()
export class RoleService implements IRoleService {
  async findByName(name: string): Promise<IRole | null> {
    return Role.findOne({ name });
  }
}
