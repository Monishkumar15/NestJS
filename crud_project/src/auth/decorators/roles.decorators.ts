import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../entities/User.entity";

// => unique identifier for storing and retriving role requirements as metadata on route handler

export const ROLS_KEY = 'roles';

// -> roles decorator markes the routes with the roles that are allowed to access them
// -> roles guard will later reads this metadata to check if the user has permission

export const Roles = (...roles : UserRole[]) => SetMetadata(ROLS_KEY, roles);
