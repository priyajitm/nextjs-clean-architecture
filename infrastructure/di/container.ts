import "reflect-metadata";
import { IRoleService } from "@/services/interfaces/IRoleService";
import { IUserService } from "@/services/interfaces/IUserService";
import { Container } from "inversify";
import { TYPES } from "./types";
import { UserService } from "@/services/UserService";
import { RoleService } from "@/services/RoleService";
import { DatabaseService } from "@/services/DatabaseService";
import { UserRepository } from "../repositories/UserRepository";

const container = new Container();

container.bind(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IRoleService>(TYPES.RoleService).to(RoleService);

export { container };
